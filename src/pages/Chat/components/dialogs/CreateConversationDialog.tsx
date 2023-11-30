import { CreateChat } from '@/api/chat'
import { User, UserConverter } from '@/classes/User'
import LoadingSpinner from '@/components/LoadingSpinner'
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    toast
} from '@/components/ui'
import { db } from '@/firebase'
import useAuth from '@/lib/hooks/useAuth'
import useRefresh from '@/lib/hooks/useRefresh'
import UserCard from '@/pages/Chat/components/common/UserCard'
import { DocumentData, QuerySnapshot, collection, doc, documentId, getDocs, or, query, where } from 'firebase/firestore'
import { AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

type SelectedUsersType = {
    [key: string]: {
        name: string
    }
}
type CreateConversationDialogProps = {
    children?: ReactNode
    tooltipContent?: ReactNode
}
export default function CreateConversationDialog({ children, tooltipContent }: CreateConversationDialogProps) {
    const { user } = useAuth()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [value, loading, error] = useCollectionOnce(
        query(collection(db, 'users'), where(documentId(), '!=', user.uid)).withConverter(UserConverter)
    )
    const [step, setStep] = useState<number>(1)
    const [selectedUsers, setSelectedUsers] = useState<SelectedUsersType>({})

    function handleCloseDialog(value: boolean) {
        setIsDialogOpen(value)
        setTimeout(() => {
            // wait for dialog to unload first
            setStep(1)
        }, 500)
    }

    async function handleSubmitBuilder(dbOperation: () => Promise<number>) {
        try {
            const numberUsers = await dbOperation()
            toast({
                title: 'Success',
                description: `New chat created successfully with ${numberUsers} user(s)`
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
            handleCloseDialog(false)
        }
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <TooltipProvider>
                    <Tooltip delayDuration={0.3}>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>{children}</DialogTrigger>
                        </TooltipTrigger>
                        {tooltipContent && (
                            <TooltipContent side="bottom" arrowPadding={10}>
                                {tooltipContent}
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
                <DialogContent className="gap-0">
                    <DialogHeader className="text-h3 font-bold">Start a conversation</DialogHeader>
                    <DialogDescription className="text-small mb-4">Create a new amazing chat room with your friends!</DialogDescription>
                    {step === 1 && (
                        <SelectUserForm
                            data={value!}
                            loading={loading}
                            error={error}
                            onNext={() => setStep(2)}
                            onSubmit={handleSubmitBuilder}
                            setSelectedUsers={setSelectedUsers}
                        />
                    )}
                    {step === 2 && <ChatMetadataForm onBack={() => setStep(1)} onSubmit={handleSubmitBuilder} selectedUsers={selectedUsers} />}
                </DialogContent>
            </Dialog>
        </>
    )
}

type SelectUserFormProps = {
    onNext: () => void
    onSubmit: (dbOperation: () => Promise<number>) => Promise<void>
    setSelectedUsers: Dispatch<SetStateAction<SelectedUsersType>>
    data: QuerySnapshot<User, DocumentData>
    loading: boolean
    error: Error | undefined
}
function SelectUserForm({ data, loading, error, onNext, onSubmit, setSelectedUsers }: SelectUserFormProps) {
    const { user } = useAuth()
    const [isUserSelected, setIsUserSelected] = useState<SelectedUsersType>({})
    const selectedLength = useMemo(() => Object.keys(isUserSelected).length, [isUserSelected])
    const [searchValue, setSearchValue] = useState('')
    const refresh = useRefresh()

    useEffect(() => {
        setIsUserSelected((prev) => ({
            ...prev,
            [user.uid]: {
                name: user.displayName!
            }
        }))
    }, [isUserSelected, user])

    async function handleSubmit_DualConversation() {
        await onSubmit(async () => {
            // check if conversation already exists
            const values = Object.keys(isUserSelected)
            const currentUserRef = doc(db, 'users', values[0])
            const selectedUserRef = doc(db, 'users', values[1])
            const q = query(
                collection(db, 'chats'),
                or(where('users', '==', [currentUserRef, selectedUserRef]), where('users', '==', [selectedUserRef, currentUserRef]))
            )
            const snapshot = await getDocs(q)

            // if not, create new conversation
            if (snapshot.empty) {
                // TODO - unlink chatName
                CreateChat(
                    Object.keys(isUserSelected),
                    Object.values(isUserSelected)
                        .map((val) => val.name)
                        .join(',')
                )
                return Object.keys(isUserSelected).length
            } else {
                throw new Error('Conversation already exists')
            }
        })
    }

    function handleSelect(id: string, name: string) {
        const keys = Object.keys(isUserSelected)

        if (keys.includes(id)) {
            setIsUserSelected((prev) => {
                delete prev[id]
                return prev
            })
        } else {
            setIsUserSelected((prev) => ({
                ...prev,
                [id]: {
                    name: name
                }
            }))
        }
        refresh()
    }

    function handleClearSelection() {
        setIsUserSelected({})
        refresh()
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error...</div>
    }

    return (
        <>
            <div className="mb-2">
                <Input
                    placeholder="Search by Name or Email"
                    className="w-full"
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
                        <UserCard
                            key={doc.id}
                            doc={doc}
                            isUserSelected={Object.keys(isUserSelected).includes(doc.id)}
                            handleSelect={() => handleSelect(doc.id, doc.data().name)}
                            searchTerm={searchValue}
                        />
                    ))}
            </ScrollArea>
            <DialogFooter className="mt-4">
                {selectedLength > 1 ? (
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
                        if (selectedLength < 2) return
                        if (selectedLength === 2) handleSubmit_DualConversation()
                        else {
                            setSelectedUsers(isUserSelected)
                            onNext()
                        }
                    }}
                    disabled={selectedLength <= 1}
                >
                    {selectedLength > 1 ? (
                        <>
                            Start conversation with&nbsp;
                            <strong className="font-bold">
                                {selectedLength} user{selectedLength !== 1 && 's'}
                            </strong>
                        </>
                    ) : (
                        <>Please select a user</>
                    )}
                </Button>
            </DialogFooter>
        </>
    )
}

type ChatMetadataFormProps = {
    onBack: () => void
    onSubmit: (dbOperation: () => Promise<number>) => Promise<void>
    selectedUsers: SelectedUsersType
}
function ChatMetadataForm({ selectedUsers, onBack, onSubmit }: ChatMetadataFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [inputChatName, setInputChatName] = useState<InputValue<string>>({
        value: '',
        error: null
    })
    const [inputAvatar, setInputAvatar] = useState<InputValue<FileInput>>({
        value: undefined,
        error: null
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleSubmit_GroupConversation() {
        setIsSubmitting(true)
        await onSubmit(async () => {
            await CreateChat(Object.keys(selectedUsers), inputChatName.value, inputAvatar.value ? inputAvatar.value.file : undefined)
            return Object.keys(selectedUsers).length
        })
        setIsSubmitting(false)
    }

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
                    <span className="text-sm font-light">{Object.keys(selectedUsers).length} people</span>
                </div>
            </div>
            <div className="mb-3">
                <Label className="text-p mb-2 block" htmlFor="input_chatname">
                    Chat name
                </Label>
                <Input id="input_chatname" value={inputChatName.value} onChange={handleChange_ChatName} />
                <div className="mt-1 block h-5 text-sm text-red-500">{inputChatName.error}</div>
            </div>
            <div>
                <div className="relative mb-2 flex justify-between">
                    <Label htmlFor="input_avatar text-p">Avatar</Label>
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
            <DialogFooter className="mt-4">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleSubmit_GroupConversation} disabled={(!inputChatName.value && !inputAvatar.value) || isSubmitting}>
                    <AnimatePresence>{isSubmitting && <LoadingSpinner type="light" className="mr-2 w-7" />}</AnimatePresence>
                    Create
                </Button>
            </DialogFooter>
        </>
    )
}
