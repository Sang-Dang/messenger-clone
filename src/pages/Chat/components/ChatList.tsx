import { Chat, ChatConverter } from '@/classes/Chat'
import LastMessage from '@/classes/LastMessage'
import { Message } from '@/classes/Message'
import { Input, ScrollArea } from '@/components/ui'
import { selectChatsSearch } from '@/features/Chat/ChatSelectors'
import {
    chatRemoved,
    chatUpdated,
    errorOccurred,
    loadedSuccessfully,
    loadingToggled
} from '@/features/Chat/ChatSlice'
import { chatLoadedWithImages } from '@/features/Chat/ChatThunks'
import { fetchUsers } from '@/features/Users/UsersThunks'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import ChatCard from '@/pages/Chat/components/ChatCard'
import { collection, doc, orderBy, query, where } from 'firebase/firestore'
import { Dispatch, SetStateAction, memo, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const ChatList = memo(() => {
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const [, loading, error, snapshot] = useCollectionData(
        query(
            collection(db, 'chats').withConverter(ChatConverter),
            where('users', 'array-contains', doc(db, 'users', user.uid)),
            orderBy('lastUpdatedOn', 'desc')
        )
    )

    if (loading) {
        dispatch(loadingToggled(true))
    }

    if (error) {
        dispatch(errorOccurred(error.message))
    }

    snapshot?.docChanges().forEach((change) => {
        if (change.type === 'added') {
            // avoid serializing the lastMessage object
            dispatch(fetchUsers(change.doc.data().users))
            dispatch(
                chatLoadedWithImages({
                    chat: {
                        ...change.doc.data(),
                        lastMessage: {
                            ...change.doc.data().lastMessage
                        } as LastMessage
                    } as Chat,
                    userId: user.uid
                })
            )
        }
        if (change.type === 'modified') {
            // avoid serializing the lastMessage object
            dispatch(
                chatUpdated({
                    ...change.doc.data(),
                    lastMessage: {
                        ...change.doc.data().lastMessage
                    } as Message
                } as Chat)
            )
            dispatch(fetchUsers(change.doc.data().users))
        }
        if (change.type === 'removed') {
            dispatch(
                chatRemoved({
                    id: change.doc.id
                })
            )
        }
    })

    dispatch(loadedSuccessfully())

    return <ChatListViewWrapper />
})

function ChatListViewWrapper() {
    const [searchTerm, setSearchTerm] = useState('')
    const chats = useAppSelector(selectChatsSearch(searchTerm))

    chats
        .sort(
            (a, b) =>
                (a.lastMessage ? a.lastUpdatedOn.toDate().getTime() : 0) -
                (b.lastMessage ? b.lastUpdatedOn.toDate().getTime() : 0)
        )
        .reverse()

    return (
        <ChatListView
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            chats={chats.map((chat) => chat.id)}
        />
    )
}

type ChatListViewProps = {
    searchTerm: string
    setSearchTerm: Dispatch<SetStateAction<string>>
    chats: string[]
}
const ChatListView = memo(
    ({ searchTerm, setSearchTerm, chats }: ChatListViewProps) => {
        return (
            <>
                <Input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for Chats"
                    className="mb-2 rounded-full p-5 focus-visible:ring-0"
                />
                <ScrollArea className="flex-grow overflow-y-auto px-3">
                    {chats.map((chat) => (
                        <div key={chat} className="my-3 first-of-type:mt-0 last-of-type:mb-0">
                            <ChatCard key={chat} chatId={chat} />
                        </div>
                    ))}
                </ScrollArea>
            </>
        )
    },
    (prev, next) =>
        prev.chats.every((id, i) => id === next.chats[i]) && prev.chats.length === next.chats.length
    // ! if anything breaks, blame this
)

export default ChatList
