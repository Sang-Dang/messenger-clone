import { ChatRoom, ChatRoomConverter } from '@/classes/ChatRoom'
import { Button, Input, Separator } from '@/components/ui'
import { auth, db } from '@/firebase'
import ChatRoomCard from '@/pages/Chat/components/ChatRoomCard'
import ChatRoomDetails from '@/pages/Chat/components/ChatRoomDetails'
import { collection, onSnapshot, or, query, where } from 'firebase/firestore'
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const MemoChatRoomDetails = memo(ChatRoomDetails)

const Chat = () => {
    const [user] = useAuthState(auth)
    const [chatList, setChatList] = useState<ChatRoom[]>([])
    const [filteredChatList, setFilteredChatList] = useState<ChatRoom[]>([])
    const [currentChatRoom, setCurrentChatRoom] = useState<string | null>(null)
    const [filterInput, setFilterInput] = useState('')
    const timeoutId = useRef<NodeJS.Timeout | null>(null)

    function handleChooseChatRoom(id: string) {
        setCurrentChatRoom(id)
    }

    function handleFilterInput(e: ChangeEvent<HTMLInputElement>) {
        setFilterInput(e.target.value)
    }

    const subscribeToChatList = useCallback(() => {
        const q = query(
            collection(db, 'chats'),
            or(where('metadata.user1', '==', user?.uid ?? ''), where('metadata.user2', '==', user?.uid ?? ''))
        ).withConverter(ChatRoomConverter)

        return onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                setChatList((prev) => [...prev, change.doc.data() as ChatRoom])
            })
        })
    }, [user?.uid])

    useEffect(() => {
        const unsubscribe = subscribeToChatList()

        return () => {
            unsubscribe()
            setChatList([])
        }
    }, [subscribeToChatList])

    useEffect(() => {
        timeoutId.current && clearTimeout(timeoutId.current)

        timeoutId.current = setTimeout(() => {
            setFilteredChatList(
                chatList.filter(
                    (chat) =>
                        (chat.metadata.user1 === user?.uid && chat.metadata.user2.includes(filterInput)) ||
                        (chat.metadata.user2 === user?.uid && chat.metadata.user1.includes(filterInput))
                )
            )
        })

        return () => {
            timeoutId.current && clearTimeout(timeoutId.current)
        }
    }, [chatList, filterInput, user?.uid])

    return (
        <div className="flex h-fullNoHeader text-black">
            <div className="w-2/12 overflow-y-auto border-r-2 border-secondary bg-primary-foreground text-black">
                <section className="flex flex-col gap-3 px-8 py-4">
                    <Input type="text" placeholder="Search for chats" value={filterInput} onChange={handleFilterInput} />
                    <Button className="w-full">Create new chat</Button>
                </section>
                <Separator className="bg-muted-foreground" />
                <section className="py-4">
                    <h3 className="px-8 text-lg font-semibold">Your chats</h3>
                    {filteredChatList.map((chat) => (
                        <ChatRoomCard key={chat.id} data={chat.metadata} className="px-8 py-4" onClick={() => handleChooseChatRoom(chat.id)} />
                    ))}
                </section>
            </div>
            <MemoChatRoomDetails chatRoomId={currentChatRoom} className="h-full w-10/12" />
        </div>
    )
}

export default Chat
