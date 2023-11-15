import { ChatLog } from '@/classes/ChatLog'
import { ChatRoomConverter } from '@/classes/ChatRoom'
import { UserConverter } from '@/classes/User'
import { auth, db } from '@/firebase'
import { cn } from '@/lib/utils'
import ChatBubble from '@/pages/Chat/ChatBubble'
import ChatInput from '@/pages/Chat/ChatInput'
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type Props = {
    className?: string
    chatRoomId: string | null
}

export default function ChatRoomDetails({ className, chatRoomId }: Props) {
    console.log('RENDER')
    const [chatMessages, setChatMessages] = useState<ChatLog[]>([])
    const [receiverAvatar, setReceiverAvatar] = useState<string | null>(null)
    const senderAvatar = auth.currentUser?.photoURL

    useEffect(() => {
        console.log('RENDER')
        let unsubscribe = () => {}

        async function getReceiverAvatar(chatId: string) {
            console.log('RUN')
            const getChatRoom = doc(collection(db, 'chats'), chatId).withConverter(ChatRoomConverter)
            const chatRoomSnap = await getDoc(getChatRoom)
            const receiverId =
                chatRoomSnap.data()?.metadata.user1 === auth.currentUser?.uid
                    ? chatRoomSnap.data()?.metadata.user2
                    : chatRoomSnap.data()?.metadata.user1
            if (receiverId) {
                const getReceiverAvatar = doc(db, 'users', receiverId).withConverter(UserConverter)
                const receiverAvatarSnap = await getDoc(getReceiverAvatar)
                setReceiverAvatar(receiverAvatarSnap.data()?.avatar ?? null)
            }
        }

        if (chatRoomId !== null) {
            console.log('RUN')
            getReceiverAvatar(chatRoomId)
            const getChatLogs = query(collection(db, 'chats', chatRoomId, 'chatlog'), orderBy('createdOn', 'desc'))
            unsubscribe = onSnapshot(getChatLogs, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    setChatMessages((prev) => [...prev, change.doc.data() as ChatLog])
                })
            })
        }

        return () => {
            unsubscribe()
            // setChatMessages([])
            // setReceiverAvatar(null)
        }
    }, [chatRoomId])

    if (chatRoomId === null) {
        return <div>None chosen</div>
    }

    return (
        <div className={cn('flex flex-col justify-end gap-3', className)}>
            <div className="px-10 py-5">
                {chatMessages.map((chat) => (
                    <ChatBubble
                        key={chat.user}
                        variant={chat.user === auth.currentUser?.uid ? 'sender' : 'receiver'}
                        avatar={chat.user === auth.currentUser?.uid ? senderAvatar ?? '' : receiverAvatar ?? ''}
                        content={chat.message}
                    />
                ))}
            </div>

            {/* <ChatInput /> */}
        </div>
    )
}
