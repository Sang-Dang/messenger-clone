import Reply from '@/classes/Reply'
import { selectUserFieldById } from '@/features/Users/UsersSelectors'
import { storage } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import { ref } from 'firebase/storage'
import { ReplyIcon } from 'lucide-react'
import { memo } from 'react'
import { useDownloadURL } from 'react-firebase-hooks/storage'

type ReplyMessageProps = {
    className?: string
    repliedTo: Reply
}
const ReplyMessage = memo(
    ({ className, repliedTo }: ReplyMessageProps) => {
        const username = useAppSelector(selectUserFieldById(repliedTo.userId, 'name'))
        return (
            <div
                className={cn(
                    'translate-y-1',
                    className,
                    repliedTo.type === 'image' && 'translate-y-1/4'
                )}
            >
                <div className="text-xs font-light text-blur">
                    <ReplyIcon className="mr-2 inline" size={12} />
                    You replied to <strong className="">{username}</strong>
                </div>
                <div
                    className={cn(
                        'w-max max-w-[25rem] overflow-hidden text-ellipsis whitespace-nowrap rounded-3xl bg-neutral-200/50 px-3 py-1 text-[13px] text-blur',
                        repliedTo.type === 'image' && 'px-1 opacity-70'
                    )}
                >
                    {repliedTo.type === 'deleted' && 'This message was deleted.'}
                    {repliedTo.type === 'image' && (
                        <ImageView src={repliedTo.message.split(';')[0]} className="h-20 w-20" />
                    )}
                    {repliedTo.type === 'text' && repliedTo.message}
                </div>
            </div>
        )
    },
    (prev, next) => {
        return prev.repliedTo.id === next.repliedTo.id
    }
)

type ImageViewProps = {
    src: string
    className?: string
    loadingClassName?: string
}
function ImageView({ src, className, loadingClassName }: ImageViewProps) {
    const [downloadUrl, loading] = useDownloadURL(ref(storage, src))

    if (loading)
        return (
            <div
                className={cn(
                    'aspect-square h-56 animate-pulse rounded-2xl bg-neutral-200/50 object-cover',
                    loadingClassName
                )}
            />
        )

    return (
        <img
            src={downloadUrl}
            alt=""
            className={cn('aspect-square h-56 rounded-2xl object-cover', className)}
        />
    )
}

export default ReplyMessage
