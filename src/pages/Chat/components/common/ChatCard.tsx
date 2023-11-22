import { Chat } from '@/classes/Chat'
import { UserConverter } from '@/classes/User'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { setChatId } from '@/features/Conversation/ConversationSlice'
import { auth, db } from '@/firebase'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import { doc, getDoc } from 'firebase/firestore'
import { MoreHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type Props = {
    chat: Chat
}

export default function ChatCard({ chat }: Props) {
    const dispatch = useAppDispatch()
    const isGroupChat = chat.users.length > 2
    const [user] = useAuthState(auth)
    const [chatData, setChatData] = useState({
        chatName: chat.chatName,
        chatAvatar: chat.avatar
    })

    // auto update chat name and avatar
    useEffect(() => {
        setChatData({
            chatName: chat.chatName,
            chatAvatar: chat.avatar
        })
    }, [chat.avatar, chat.chatName])

    useEffect(() => {
        async function getRecipient(id: string) {
            const q = doc(db, 'users', id).withConverter(UserConverter)
            const snapshot = await getDoc(q)
            setChatData((prev) => ({
                ...prev,
                chatName: snapshot.data()!.name,
                chatAvatar: snapshot.data()!.avatar
            }))
        }

        if (!isGroupChat) {
            const otherUser = chat.users.find((curr) => curr !== user?.uid)! // cannot be undefined
            getRecipient(otherUser)
        }
    }, [chat.users, isGroupChat, user?.uid])

    function handleChangeChat() {
        dispatch(
            setChatId({
                chatId: chat.id
            })
        )
    }

    return (
        <div className="group relative">
            <div className="peer pointer-events-none invisible absolute right-5 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="rounded-full bg-white p-2 shadow-lg" id="chatcard_more_btn">
                            <MoreHorizontal size={25} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                        <DropdownMenuItem>Hi</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div
                id="chatcard"
                className="group flex h-[80px] cursor-pointer select-none gap-5 rounded-lg p-[10px] transition-all hover:bg-neutral-200 peer-hover:bg-neutral-200"
                onClick={handleChangeChat}
            >
                <img src={chatData.chatAvatar} alt="avatar" className="h-[60px] w-[60px] rounded-full" />
                <div className="flex flex-col items-start justify-center">
                    <h5 className="text-lg font-semibold">{chatData.chatName}</h5>
                    <p>{chat.lastMessage ? chat.lastMessage : 'There are no messages.'}</p>
                </div>
            </div>
        </div>
    )
}
