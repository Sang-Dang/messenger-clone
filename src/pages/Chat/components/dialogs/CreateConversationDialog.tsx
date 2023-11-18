import { CreateChat } from '@/api/chat'
import { User, UserConverter } from '@/classes/User'
import HighlightedSubstring from '@/components/HighlightedString'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
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
import { cn } from '@/lib/utils'
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot, collection, query } from 'firebase/firestore'
import { Check } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'

type CreateConversationDialogProps = {
    children?: ReactNode
}
export default function CreateConversationDialog({ children }: CreateConversationDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUserSelected, setIsUserSelected] = useState<Set<string>>(new Set()) // slight prop drilling here because submit is in footer
    const [value, loading, error] = useCollectionOnce(query(collection(db, 'users')).withConverter(UserConverter))
    const refresh = useRefresh()

    useEffect(() => {
        setIsUserSelected(new Set()) // sets don't trigger rerender fuck react
    }, [isDialogOpen])

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader className="font-bold">Start a conversation</DialogHeader>
                    <DialogDescription>Who do you want to talk to? Please select a user below!</DialogDescription>
                    <div className="mt-5">
                        <ContentLoader isUserSelected={isUserSelected} handleSelect={handleSelect} data={value!} loading={loading} error={error} />
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
                        <Button onClick={handleSubmit} disabled={isUserSelected.size === 0}>
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

type ContentLoaderProps = {
    isUserSelected: Set<string>
    handleSelect: (id: string) => void
    data: QuerySnapshot<User, DocumentData>
    loading: boolean
    error: Error | undefined
}
function ContentLoader({ isUserSelected, handleSelect, data, loading, error }: ContentLoaderProps) {
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
                <Input placeholder="Search by Name or Email" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
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

type UserCardProps = {
    doc: QueryDocumentSnapshot<User, DocumentData>
    isUserSelected: Set<string>
    handleSelect: (id: string) => void
    searchTerm: string
}
function UserCard({ doc, isUserSelected, handleSelect, searchTerm }: UserCardProps) {
    const refresh = useRefresh()
    const isSelected = isUserSelected.has(doc.id)

    function handleSelectWrapper(id: string) {
        handleSelect(id)
        refresh()
    }

    return (
        <>
            <button
                key={doc.id}
                className={cn(
                    'mb-2 flex w-full cursor-pointer gap-3 rounded-lg border-2 border-neutral-200/30 bg-neutral-50/30 p-3 text-left transition-all hover:border-neutral-50/30 hover:shadow-md focus:border-neutral-50/30 focus:shadow-md focus:outline-none',
                    isSelected && 'border-blue-500/50 bg-blue-500/50 shadow-md'
                )}
                onClick={() => handleSelectWrapper(doc.id)}
            >
                <Avatar className="rounded-lg">
                    <AvatarImage src={doc.data().avatar} alt={doc.data().name} />
                    <AvatarFallback>{doc.data().name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-grow flex-col justify-center gap-1">
                    <h6 className="text-lg font-bold leading-none">
                        <HighlightedSubstring original={doc.data().name} substring={searchTerm} />
                    </h6>
                    <p className="text-xs">
                        <HighlightedSubstring original={doc.data().email} substring={searchTerm} />
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className="grid h-5 w-5 place-items-center rounded-lg bg-neutral-100">{isSelected && <Check className="w-4" />}</div>
                </div>
            </button>
        </>
    )
}
