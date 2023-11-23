import { CreateChat } from '@/api/chat'
import { User, UserConverter } from '@/classes/User'
import {
    Avatar,
    AvatarImage,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    Input,
    Label,
    ScrollArea,
    toast
} from '@/components/ui'
import { db } from '@/firebase'
import useRefresh from '@/lib/hooks/useRefresh'
import UserCard from '@/pages/Chat/components/common/UserCard'
import { DocumentData, QuerySnapshot, collection, query } from 'firebase/firestore'
import { X } from 'lucide-react'
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

type CreateConversationDialogProps = {
    children?: ReactNode
}
export default function CreateConversationDialog({ children }: CreateConversationDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUserSelected, setIsUserSelected] = useState<Set<string>>(new Set()) // slight prop drilling here because submit is in footer
    const [value, loading, error] = useCollectionOnce(query(collection(db, 'users')).withConverter(UserConverter))
    const inputChatName = useState<InputValue<string>>({
        value: '',
        error: null
    })
    const inputAvatar = useState<InputValue<FileInput>>({
        value: undefined,
        error: null
    })
    const [step, setStep] = useState<number>(1)
    const refresh = useRefresh()

    useEffect(() => {
        setIsUserSelected(new Set()) // sets don't trigger rerender fuck react
    }, [isDialogOpen])

    function handleCloseDialog(value: boolean) {
        setIsDialogOpen(value)
        setTimeout(() => {
            // wait for dialog to unload first
            setStep(1)
            inputChatName[1]({
                value: '',
                error: null
            })
            inputAvatar[1]({
                value: undefined,
                error: null
            })
        }, 500)
    }

    function handleSelect(id: string) {
        if (isUserSelected.has(id)) {
            isUserSelected.delete(id)
        } else {
            isUserSelected.add(id)
        }
        setIsUserSelected(isUserSelected)
        refresh()
    }

    function handleSubmit() {
        try {
            CreateChat(
                Array.from(isUserSelected),
                inputChatName[0].value,
                inputAvatar[0].value ? URL.createObjectURL(inputAvatar[0].value.file!) : ''
            )
            toast({
                title: 'Success',
                description: `New chat created successfully with ${isUserSelected.size} user(s)`
            })
            setIsDialogOpen(false)
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive'
                })
            }
        }
    }

    function handleClearSelection() {
        setIsUserSelected(new Set())
        refresh()
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader className="font-bold">Start a conversation</DialogHeader>
                    <DialogDescription>Who do you want to talk to? Please select a user below!</DialogDescription>
                    <div className="mt-4">
                        {step === 1 && (
                            <SelectUserForm
                                isUserSelected={isUserSelected}
                                handleSelect={handleSelect}
                                data={value!}
                                loading={loading}
                                error={error}
                            />
                        )}
                        {step === 2 && <ChatMetadataForm numberPeople={isUserSelected.size} avatar={inputAvatar} chatName={inputChatName} />}
                    </div>
                    <DialogFooter>
                        {step === 1 && (
                            <>
                                {isUserSelected.size > 0 ? (
                                    <Button variant="outline" onClick={handleClearSelection}>
                                        Clear
                                    </Button>
                                ) : (
                                    <DialogTrigger>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogTrigger>
                                )}
                                <Button
                                    onClick={() => {
                                        if (isUserSelected.size === 0) return
                                        if (isUserSelected.size === 1) handleSubmit()
                                        else setStep(2)
                                    }}
                                    disabled={isUserSelected.size === 0}
                                >
                                    {isUserSelected.size > 0 ? (
                                        <>
                                            Start conversation with&nbsp;
                                            <strong className="font-bold">
                                                {isUserSelected.size} user{isUserSelected.size > 1 && 's'}
                                            </strong>
                                        </>
                                    ) : (
                                        <>Please select a user</>
                                    )}
                                </Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button onClick={handleSubmit}>Create</Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

type SelectUserFormProps = {
    isUserSelected: Set<string>
    handleSelect: (id: string) => void
    data: QuerySnapshot<User, DocumentData>
    loading: boolean
    error: Error | undefined
}
function SelectUserForm({ isUserSelected, handleSelect, data, loading, error }: SelectUserFormProps) {
    const [searchValue, setSearchValue] = useState('')

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error...</div>
    }

    return (
        <>
            <div className="mb-4">
                <Input
                    placeholder="Search by Name or Email"
                    className="w-1/2"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    autoComplete="off"
                    aria-autocomplete="none"
                />
            </div>
            <ScrollArea className="h-max max-h-96 overflow-y-auto">
                {data.docs
                    .filter(
                        (doc) =>
                            doc.data().name.toLowerCase().includes(searchValue.toLowerCase()) ||
                            doc.data().email.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((doc) => (
                        <UserCard key={doc.id} doc={doc} isUserSelected={isUserSelected} handleSelect={handleSelect} searchTerm={searchValue} />
                    ))}
            </ScrollArea>
        </>
    )
}

type ChatMetadataFormProps = {
    numberPeople: number
    chatName: [InputValue<string>, Dispatch<SetStateAction<InputValue<string>>>]
    avatar: [InputValue<FileInput>, Dispatch<SetStateAction<InputValue<FileInput>>>]
}
function ChatMetadataForm({ numberPeople, chatName, avatar }: ChatMetadataFormProps) {
    const [inputChatName, setInputChatName] = chatName
    const [inputAvatar, setInputAvatar] = avatar
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleChange_ChatName(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        if (value.trim() === '') {
            setInputChatName({
                value: '',
                error: 'Chat name cannot be empty'
            })
            return
        }

        setInputChatName({
            value: value,
            error: null
        })
    }

    function handleChange_Avatar(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files![0]

        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setInputAvatar({
                value: undefined,
                error: 'File size cannot exceed 5MB'
            })
            return
        }

        if (!file.type.startsWith('image/')) {
            setInputAvatar({
                value: undefined,
                error: 'File must be an image'
            })
            return
        }

        setInputAvatar({
            value: {
                file: file,
                name: file.name
            },
            error: null
        })
    }

    return (
        <>
            <div className="mb-5 flex h-[80px] gap-3 rounded-lg border-2 border-neutral-200 bg-neutral-200/75 p-[12px]">
                <Avatar className="h-[56px] w-[56px]">
                    <AvatarImage
                        src={inputAvatar.value ? URL.createObjectURL(inputAvatar.value.file!) : '/img/user-default.jpg'}
                        alt="avatar"
                        className=""
                    />
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                    <h5 className="text-lg font-bold">{inputChatName.value ? inputChatName.value : 'Name of your group chat'}</h5>
                    <span className="text-sm font-light">{numberPeople + 1} people</span>
                </div>
            </div>
            <div className="mb-3">
                <Label className="mb-2 block" htmlFor="input_chatname">
                    Chat name
                </Label>
                <Input id="input_chatname" value={inputChatName.value} onChange={handleChange_ChatName} />
                <div className="mt-1 block h-5 text-sm text-red-500">{inputChatName.error}</div>
            </div>
            <div>
                <div className="relative mb-2 flex justify-between">
                    <Label htmlFor="input_avatar">Avatar</Label>
                    {inputAvatar.value && (
                        <Button
                            variant="ghost"
                            className="absolute right-0 top-1/2 h-min w-min -translate-y-1/2 p-0"
                            onClick={() => {
                                setInputAvatar({
                                    value: undefined,
                                    error: null
                                })
                                fileInputRef.current!.value = ''
                            }}
                        >
                            <X size="20" />
                        </Button>
                    )}
                </div>
                <Input id="input_avatar" type="file" accept="image/*" onChange={handleChange_Avatar} className="cursor-pointer" ref={fileInputRef} />
                <div className="mt-1 block h-5 text-sm text-red-500">{inputAvatar.error}</div>
            </div>
        </>
    )
}
