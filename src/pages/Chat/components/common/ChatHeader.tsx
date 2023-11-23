import { Chat } from '@/classes/Chat'
import { UserConverter } from '@/classes/User'
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@/components/ui'
import { db } from '@/firebase'
import { doc } from 'firebase/firestore'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'

type Props = {
    chat: Chat | null | undefined
    loading: boolean
    error: any
    userId: string | undefined
}

export default function ChatHeader({ chat, loading, error, userId }: Props) {
    const [recipient, loadingAvatar] = useDocumentDataOnce(
        chat?.users.length === 2 && userId
            ? doc(db, 'users', chat.users.filter((user) => user !== userId)[0]).withConverter(UserConverter)
            : undefined
    )

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <header className="flex h-[70px] w-full items-center gap-5 bg-neutral-200/70 px-[30px] py-[10px]">
            {!loading && !loadingAvatar ? (
                <>
                    <Avatar className="h-[50px] w-[50px]">
                        <AvatarImage src={recipient?.avatar ?? chat!.avatar} alt="avatar" />
                        <AvatarFallback>{recipient?.name.slice(0, 2) ?? chat!.chatName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-semibold">{recipient?.name ?? chat!.chatName}</h1>
                </>
            ) : (
                <Skeleton className="h-[50px] w-[50px]" />
            )}
        </header>
    )
}
