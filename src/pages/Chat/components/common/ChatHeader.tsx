import { Chat } from '@/classes/Chat'
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@/components/ui'

type Props = {
    chat: Chat | null | undefined
    loading: boolean
    error: any
}

export default function ChatHeader({ chat, loading, error }: Props) {
    return (
        <header className="flex h-[70px] w-full items-center gap-5 bg-neutral-200/70 px-[30px] py-[10px]">
            {!loading ? (
                <>
                    <Avatar className="h-[50px] w-[50px]">
                        <AvatarImage src={chat!.avatar} alt="avatar" />
                        <AvatarFallback>{chat!.chatName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-semibold">{chat!.chatName}</h1>
                </>
            ) : (
                <Skeleton className="h-[50px] w-[50px]" />
            )}
        </header>
    )
}
