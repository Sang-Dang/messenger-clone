import { ChatRoom, ChatRoomConverter } from '@/classes/ChatRoom'
import { auth, db } from '@/firebase'
import ChatRoomCard from '@/pages/Chat/ChatRoomCard'
import ChatRoomDetails from '@/pages/Chat/ChatRoomDetails'
import { collection, onSnapshot, or, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const Chat = () => {
    const user = auth.currentUser

    const [chatList, setChatList] = useState<ChatRoom[]>([])
    const [currentChatRoom, setCurrentChatRoom] = useState<string | null>(null)

    function handleChooseChatRoom(id: string) {
        setCurrentChatRoom(id)
    }

    useEffect(() => {
        const q = query(
            collection(db, 'chats'),
            or(where('metadata.user1', '==', user?.uid ?? ''), where('metadata.user2', '==', user?.uid ?? ''))
        ).withConverter(ChatRoomConverter)

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                setChatList((prev) => [...prev, change.doc.data() as ChatRoom])
            })
        })

        return () => {
            unsubscribe()
            setChatList([])
        }
    }, [user?.uid])

    return (
        <div className="flex h-fullNoHeader text-black">
            <div className="w-2/12 overflow-y-auto bg-primary-foreground text-black">
                {chatList.map((chat) => (
                    <ChatRoomCard key={chat.id} data={chat.metadata} className="px-8 py-4" onClick={() => handleChooseChatRoom(chat.id)} />
                ))}
            </div>
            <ChatRoomDetails chatRoomId={currentChatRoom} className="h-full w-10/12" />
        </div>
    )
}

export default Chat
