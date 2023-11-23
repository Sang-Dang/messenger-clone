import { Message } from '@/classes/Message'
import { User } from '@/classes/User'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import { useAuthState } from 'react-firebase-hooks/auth'

type Props = {
    data: Message
    user: User | undefined
}
export default function MessageBubble({ data, user }: Props) {
    const [current] = useAuthState(auth)

    return (
        user && (
            <div className={cn('flex min-h-[50px] gap-3', data.userId === current?.uid && 'flex-row-reverse')}>
                <Avatar className="aspect-square h-full w-[50px]">
                    <AvatarImage src={user.avatar} alt="avatar" className="h-full w-full" />
                    <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <div className="inline w-max rounded-lg bg-blue-500 p-3 font-[500] text-white">{data.message}</div>
            </div>
        )
    )
}
