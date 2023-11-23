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
import { auth, db } from '@/firebase'
import useRefresh from '@/lib/hooks/useRefresh'
import UserCard from '@/pages/Chat/components/common/UserCard'
import { DocumentData, QuerySnapshot, collection, doc, documentId, getDocs, or, query, where } from 'firebase/firestore'
import { X } from 'lucide-react'
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

type CreateConversationDialogProps = {
    children?: ReactNode
}
export default function CreateConversationDialog({ children }: CreateConversationDialogProps) {
    const [user] = useAuthState(auth)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [value, loading, error] = useCollectionOnce(
        query(collection(db, 'users'), where(documentId(), '!=', user?.uid)).withConverter(UserConverter)
    )
    const [step, setStep] = useState<number>(1)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

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
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader className="font-bold">Start a conversation</DialogHeader>
                    <DialogDescription className="mb-4">Who do you want to talk to? Please select a user below!</DialogDescription>
                    {step === 1 && (
                        <SelectUserForm
                            data={value!}
                            loading={loading}
                            error={error}
                            onNext={() => setStep(2)}
                            onSubmit={handleSubmitBuilder}
                            setSelectedUsers={setSelectedUsers}
                            userId={user!.uid}
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
    onSubmit: (dbOperation: () => Promise<number>) => void
    setSelectedUsers: (users: string[]) => void
    data: QuerySnapshot<User, DocumentData>
    loading: boolean
    error: Error | undefined
    userId: string
}
function SelectUserForm({ data, loading, error, onNext, onSubmit, setSelectedUsers, userId }: SelectUserFormProps) {
    const [isUserSelected, setIsUserSelected] = useState<Set<string>>(new Set())
    const [searchValue, setSearchValue] = useState('')
    const refresh = useRefresh()

    useEffect(() => {
        isUserSelected.add(userId)
    }, [isUserSelected, userId])

    function handleSubmit_DualConversation() {
        onSubmit(async () => {
            // check if conversation already exists
            const values = isUserSelected.values()
            const currentUserRef = doc(db, 'users', values.next().value)
            const selectedUserRef = doc(db, 'users', values.next().value)
            const q = query(
                collection(db, 'chats'),
                or(where('users', '==', [currentUserRef, selectedUserRef]), where('users', '==', [selectedUserRef, currentUserRef]))
            )
            const snapshot = await getDocs(q)

            // // fetch user data
            // const recipientId = Array.from(isUserSelected).filter((id) => id !== userId)[0]
            // const recipientRef = doc(db, 'users', recipientId)
            // const recipientSnapshot = await getDoc(recipientRef)
            // const recipient = recipientSnapshot.data() as User

            // if not, create new conversation
            if (snapshot.empty) {
                CreateChat(Array.from(isUserSelected))
                return isUserSelected.size
            } else {
                throw new Error('Conversation already exists')
            }
        })
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

    function handleClearSelection() {
        setIsUserSelected(new Set())
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
            <DialogFooter>
                {isUserSelected.size > 1 ? (
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
                        if (isUserSelected.size < 2) return
                        if (isUserSelected.size === 2) handleSubmit_DualConversation()
                        else {
                            setSelectedUsers(Array.from(isUserSelected))
                            onNext()
                        }
                    }}
                    disabled={isUserSelected.size <= 1}
                >
                    {isUserSelected.size > 1 ? (
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
            </DialogFooter>
        </>
    )
}

type ChatMetadataFormProps = {
    onBack: () => void
    onSubmit: (dbOperation: () => Promise<number>) => void
    selectedUsers: string[]
}
function ChatMetadataForm({ selectedUsers, onBack, onSubmit }: ChatMetadataFormProps) {
    const [inputChatName, setInputChatName] = useState<InputValue<string>>({
        value: '',
        error: null
    })
    const [inputAvatar, setInputAvatar] = useState<InputValue<FileInput>>({
        value: undefined,
        error: null
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleSubmit_GroupConversation() {
        onSubmit(async () => {
            CreateChat(selectedUsers, inputChatName.value, inputAvatar.value ? URL.createObjectURL(inputAvatar.value.file!) : '')
            return selectedUsers.length
        })
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
                    <span className="text-sm font-light">{selectedUsers.length} people</span>
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
            <DialogFooter>
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={handleSubmit_GroupConversation} disabled={!inputChatName.value && !inputAvatar.value}>
                    Create
                </Button>
            </DialogFooter>
        </>
    )
}
