import { Chat, ChatConverter } from '@/classes/Chat'
import { MessageConverter } from '@/classes/Message'
import { Avatar, AvatarFallback, AvatarImage, Input } from '@/components/ui'
import { addMessage, resetState } from '@/features/Conversation/ConversationSlice'
import { auth, db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'

export default function ConversationView() {
    const [user] = useAuthState(auth)
    const [chatMetadata, setChatMetadata] = useState<Chat | null>(null)
    const chatId = useAppSelector((state) => state.conversation.value.chatId)
    const data = useAppSelector((state) => state.conversation.value)
    const dispatch = useAppDispatch()

    useEffect(() => {
        let unsubscribe = () => {}

        if (chatId) {
            unsubscribe = onSnapshot(query(collection(db, 'chats', chatId, 'messages')).withConverter(MessageConverter), (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        dispatch(
                            addMessage({
                                ...change.doc.data()
                            })
                        )
                    }
                    if (change.type === 'removed') {
                        console.log('removed')
                    }
                    if (change.type === 'modified') {
                        console.log('modified')
                    }
                })
            })
        }

        return () => {
            unsubscribe()
            dispatch(resetState())
            setChatMetadata(null)
        }
    }, [dispatch, chatId, user?.uid])

    useEffect(() => {
        async function getChatMetadata(id: string) {
            const q = doc(db, 'chats', id).withConverter(ChatConverter)
            const snapshot = await getDoc(q)

            if (!snapshot.exists()) {
                return
            }

            setChatMetadata(snapshot.data() as Chat)

            const userId = snapshot.data()!.users.filter((u) => u !== user?.uid)[0]
            const q1 = doc(db, 'users', userId)
            const snapshot1 = await getDoc(q1)

            if (!snapshot1.exists() || snapshot.data().users.length !== 2) {
                return
            }

            setChatMetadata(
                (prev) =>
                    ({
                        ...prev,
                        avatar: snapshot1.data()!.avatar,
                        chatName: snapshot1.data()!.name
                    }) as Chat
            )
        }

        if (chatMetadata === null && chatId) {
            getChatMetadata(chatId)
        }
    }, [chatId, chatMetadata, user?.uid])

    if (!chatId) {
        return <div>Please select a chat.</div>
    }

    if (!chatMetadata) {
        return <div>Loading...</div>
    }

    // if (loading) {
    //     return <div>Loading...</div>
    // }

    return (
        <div>
            <header className="flex h-[70px] w-full items-center gap-5 bg-neutral-200/70 px-[30px] py-[10px]">
                <Avatar className="h-[50px] w-[50px]">
                    <AvatarImage src={chatMetadata.avatar} alt="avatar" />
                    <AvatarFallback>{chatMetadata.chatName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-semibold">{chatMetadata.chatName}</h1>
            </header>
            <div>
                {data.messageIds.length === 0 ? (
                    <div>No messages yet.</div>
                ) : (
                    Object.entries(data.messages).map(([id, d]) => <div key={id}>{d.message}</div>)
                )}
                <Input />
            </div>
        </div>
    )
}
