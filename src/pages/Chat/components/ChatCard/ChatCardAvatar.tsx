import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { storage } from '@/firebase'
import { cn } from '@/lib/utils'
import { getDownloadURL, ref } from 'firebase/storage'
import { memo, useEffect, useState } from 'react'

type ChatCardAvatarProps = {
    className?: string
    avatar: string
    fallback: string
}
const ChatCardAvatar = memo(({ className, avatar, fallback }: ChatCardAvatarProps) => {
    const [avatarObj, setAvatarObj] = useState<string | undefined>()

    useEffect(() => {
        if (avatar.startsWith('chatAvatars/')) {
            const storageRef = ref(storage, avatar)
            getDownloadURL(storageRef)
                .then((url) => {
                    setAvatarObj(url)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            setAvatarObj(avatar)
        }
    }, [avatar])

    return (
        <Avatar className={cn(className)}>
            <AvatarImage src={avatarObj} alt="avatar" className="h-[50px] w-[50px]" />
            <AvatarFallback className="h-[50px] w-[50px] text-neutral-900 ">
                {fallback}
            </AvatarFallback>
        </Avatar>
    )
})

export default ChatCardAvatar
