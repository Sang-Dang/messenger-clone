import { selectUserFieldById } from '@/features/Users/UsersSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import { Avatar } from '@nextui-org/react'
import { User } from 'lucide-react'

type MessageAvatarProps = {
    userId: string
    className?: string
}

export default function MessageAvatar({ userId, className }: MessageAvatarProps) {
    const avatar = useAppSelector(selectUserFieldById(userId, 'avatar'))

    return <Avatar src={avatar} radius="full" isBordered className={cn(className)} icon={<User />} />
}
