import { Chat, ChatConverter } from '@/classes/Chat'
import { fetchUsers } from '@/features/Users/UsersSlice'
import { db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAuth from '@/lib/hooks/useAuth'
import ChatCard from '@/pages/Chat/components/common/ChatCard'
import { collection, doc, orderBy, query, where } from 'firebase/firestore'
import { memo } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function ChatList() {
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const [data, loading, error] = useCollectionData(
        query(
            collection(db, 'chats').withConverter(ChatConverter),
            where('users', 'array-contains', doc(db, 'users', user.uid)),
            orderBy('lastUpdatedOn', 'desc')
        )
    )

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error.message}</div>
    }

    dispatch(fetchUsers(Array.from(new Set(data!.map((cur) => cur.users).flat(1)))))

    return <ChatListView chats={data!} />
}

type ChatListViewProps = {
    chats: Chat[]
}
function ChatListView({ chats }: ChatListViewProps) {
    const ChatCardMemo = memo(ChatCard)

    return (
        <div className="flex flex-col gap-3">
            {chats.map((cur) => (
                <ChatCardMemo key={cur.id} chat={cur} />
            ))}
        </div>
    )
}
