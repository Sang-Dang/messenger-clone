import { ChatMetadata } from '@/classes/ChatMetadata'
import { User } from '@/classes/User'
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from '@/components/ui'
import { auth, db } from '@/firebase'
import { cn } from '@/lib/utils'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type Props = {
    data: ChatMetadata
    className?: string
    onClick?: () => void
}

export default function ChatRoomCard({ data, className, onClick }: Props) {
    const [user] = useAuthState(auth)
    const [userData, setUserData] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const recipient = useMemo(() => (data.user1 === user?.uid ? data.user2 : data.user1), [data.user1, data.user2, user?.uid])

    useEffect(() => {
        const docRef = doc(db, 'users', recipient)
        getDoc(docRef).then((data) => {
            if (data.exists()) {
                setUserData(data.data() as User)
            }
            setIsLoading(false)
        })

        return () => {
            setUserData(null)
        }
    }, [recipient])

    if (isLoading) {
        return (
            <div className={cn('flex cursor-pointer items-center gap-3', className)}>
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-3 w-40 rounded-md" />
                </div>
            </div>
        )
    }

    if (!userData) {
        return null
    }

    return (
        <div className={cn('flex cursor-pointer items-center gap-3 transition-all hover:bg-neutral-200/50', className)} onClick={onClick}>
            <Avatar>
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name}</AvatarFallback>
            </Avatar>
            <div>
                <h4 className="w-40 select-none overflow-hidden overflow-ellipsis whitespace-nowrap text-[16px] font-bold">{userData.name}</h4>
                <p className="text-xs font-light">{new Date(data.lastUpdatedOn.seconds * 1000).toDateString()}</p>
            </div>
        </div>
    )
}
