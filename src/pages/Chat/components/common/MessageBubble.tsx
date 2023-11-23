import { Message } from '@/classes/Message'
import { auth } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

type Props = {
    data: Message
}
export default function MessageBubble({ data }: Props) {
    const [user] = useAuthState(auth)

    return (
        <div>
            <div className="inline w-max rounded-lg bg-blue-500 p-3">{data.message}</div>
        </div>
    )
}
