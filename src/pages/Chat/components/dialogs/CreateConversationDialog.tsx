import { CreateChat } from '@/api/chat'
import { User, UserConverter } from '@/classes/User'
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    Input,
    ScrollArea,
    toast
} from '@/components/ui'
import { db } from '@/firebase'
import useRefresh from '@/lib/hooks/useRefresh'
import UserCard from '@/pages/Chat/components/common/UserCard'
import { DocumentData, QuerySnapshot, collection, query } from 'firebase/firestore'
import { ReactNode, useEffect, useState } from 'react'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

type CreateConversationDialogProps = {
    children?: ReactNode
}
export default function CreateConversationDialog({ children }: CreateConversationDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUserSelected, setIsUserSelected] = useState<Set<string>>(new Set()) // slight prop drilling here because submit is in footer
    const [value, loading, error] = useCollectionOnce(query(collection(db, 'users')).withConverter(UserConverter))
    const [step, setStep] = useState<number>(1)
    const refresh = useRefresh()

    useEffect(() => {
        setIsUserSelected(new Set()) // sets don't trigger rerender fuck react
    }, [isDialogOpen])

    function handleCloseDialog(value: boolean) {
        setIsDialogOpen(value)
        setStep(1)
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
            CreateChat(Array.from(isUserSelected))
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
                    <div className="mt-5">
                        {step === 1 && (
                            <SelectUserForm
                                isUserSelected={isUserSelected}
                                handleSelect={handleSelect}
                                data={value!}
                                loading={loading}
                                error={error}
                            />
                        )}
                        {step === 2 && <ChatMetadataForm />}
                    </div>
                    <DialogFooter>
                        {isUserSelected.size > 0 ? (
                            <Button variant="outline" onClick={handleClearSelection}>
                                Clear
                            </Button>
                        ) : (
                            <DialogTrigger>
                                <Button variant="outline">Cancel</Button>
                            </DialogTrigger>
                        )}
                        <Button onClick={() => setStep(2)} disabled={isUserSelected.size === 0}>
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

type ChatMetadataFormProps = {}
function ChatMetadataForm({}: ChatMetadataFormProps) {
    return (
        <div>
            <Input />
        </div>
    )
}
