import { ChatLog } from '@/classes/ChatLog'
import { ChatRoomConverter } from '@/classes/ChatRoom'
import { UserConverter } from '@/classes/User'
import { auth, db } from '@/firebase'
import { cn } from '@/lib/utils'
import ChatBubble from '@/pages/Chat/components/ChatBubble'
import ChatInput from '@/pages/Chat/components/ChatInput'
import { Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

type Props = {
    className?: string
    chatRoomId: string | null
}

export default function ChatRoomDetails({ className, chatRoomId }: Props) {
    const [chatMessages, setChatMessages] = useState<ChatLog[]>([])
    const [receiverAvatar, setReceiverAvatar] = useState<string | null>(null)
    const senderAvatar = auth.currentUser?.photoURL

    const createNewMessage = useCallback(
        async (message: string, userId: string) => {
            await addDoc(collection(db, 'chats', chatRoomId!, 'chatlog'), {
                message,
                user: userId,
                createdOn: Timestamp.now()
            })
        },
        [chatRoomId]
    )

    async function getReceiverAvatar(chatId: string) {
        const getChatRoom = doc(collection(db, 'chats'), chatId).withConverter(ChatRoomConverter)
        const chatRoomSnap = await getDoc(getChatRoom)
        const receiverId =
            chatRoomSnap.data()?.metadata.user1 === auth.currentUser?.uid ? chatRoomSnap.data()?.metadata.user2 : chatRoomSnap.data()?.metadata.user1
        if (receiverId) {
            const getReceiverAvatar = doc(db, 'users', receiverId).withConverter(UserConverter)
            const receiverAvatarSnap = await getDoc(getReceiverAvatar)
            setReceiverAvatar(receiverAvatarSnap.data()?.avatar ?? null)
        }
    }

    const subscribeToChat = useCallback((id: string) => {
        const getChatLogs = query(collection(db, 'chats', id, 'chatlog'), orderBy('createdOn', 'asc'))
        return onSnapshot(getChatLogs, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                setChatMessages((prev) => [...prev, change.doc.data() as ChatLog])
            })
        })
    }, [])

    useEffect(() => {
        let unsubscribe = () => {}

        if (chatRoomId !== null) {
            getReceiverAvatar(chatRoomId)
            unsubscribe = subscribeToChat(chatRoomId)
        }

        return () => {
            unsubscribe()
            setChatMessages([])
            setReceiverAvatar(null)
        }
    }, [chatRoomId, subscribeToChat])

    if (chatRoomId === null) {
        return <div>None chosen</div>
    }

    return (
        <div className={cn('flex flex-col justify-end', className)}>
            <div className="flex flex-col gap-3 px-10 py-5">
                {chatMessages.length === 0 ? (
                    <div className="h-full w-full">Send a message</div>
                ) : (
                    chatMessages.map((chat) => (
                        <ChatBubble
                            key={chat.user}
                            variant={chat.user === auth.currentUser?.uid ? 'sender' : 'receiver'}
                            avatar={chat.user === auth.currentUser?.uid ? senderAvatar ?? '' : receiverAvatar ?? ''}
                            content={chat.message}
                        />
                    ))
                )}
            </div>

            <ChatInput onSubmit={createNewMessage} />
        </div>
    )
}
