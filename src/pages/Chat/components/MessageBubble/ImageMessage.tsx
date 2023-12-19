import { storage } from '@/firebase'
import { cn } from '@/lib/utils'
import { Image, Skeleton } from '@nextui-org/react'
import { ref as storageRef } from 'firebase/storage'
import { Expand } from 'lucide-react'
import { useDownloadURL } from 'react-firebase-hooks/storage'

type ImageMessageProps = {
    imageUrls: string[]
    isSelf: boolean
    className?: string
    imageClassName?: string
}

export default function ImageMessage({
    imageUrls,
    isSelf,
    className,
    imageClassName
}: ImageMessageProps) {
    const imageFactor = imageUrls.length % 3

    return (
        <div
            className={cn(
                'grid w-message items-center gap-1',
                isSelf && 'justify-items-end',
                imageUrls.length === 1 && 'grid-cols-1',
                imageUrls.length === 2 && 'grid-cols-2',
                imageUrls.length > 2 && 'grid-cols-3',
                className
            )}
        >
            {imageUrls.map((url, index) => (
                <ImageView
                    key={url}
                    imageUrl={url}
                    className={cn(
                        imageUrls.length === 1 && 'h-full max-h-[20rem] w-full',
                        imageUrls.length === 2 && 'h-64',
                        imageUrls.length > 2 &&
                            cn(
                                'h-72',
                                imageFactor === 1 &&
                                    index === imageUrls.length - 1 &&
                                    'col-span-3 w-full',
                                imageFactor === 2 &&
                                    index === imageUrls.length - 1 &&
                                    'col-span-2 w-full'
                            )
                    )}
                    imageClassName={cn(
                        'rounded-md',
                        index === 0 && 'rounded-tl-[30px]',
                        index === imageUrls.length - 1 && 'rounded-br-[30px]',
                        ((imageUrls.length === 1 && index === 0) ||
                            (imageUrls.length === 2 && index === 1) ||
                            (imageUrls.length > 2 && index === 2)) &&
                            'rounded-tr-[30px]',
                        ((imageUrls.length <= 2 && index === 0) ||
                            (imageUrls.length > 2 &&
                                ((imageFactor === 0 && index === imageUrls.length - 3) ||
                                    (imageFactor === 1 && index === imageUrls.length - 1) ||
                                    (imageFactor === 2 && index === imageUrls.length - 2)))) &&
                            'rounded-bl-[30px]',
                        imageClassName
                    )}
                />
            ))}
        </div>
    )
}

type ImageViewProps = {
    imageUrl: string
    className?: string
    imageClassName?: string
}
function ImageView({ imageUrl, className, imageClassName }: ImageViewProps) {
    const [image, loading, error] = useDownloadURL(storageRef(storage, imageUrl))

    if (loading) {
        return <Skeleton className={cn(className)} />
    }

    if (error) {
        console.error(error)
        return <Skeleton className={cn(className)} />
    }

    return (
        <div className={cn('group relative select-none', className)}>
            <Image
                removeWrapper
                src={image}
                alt="image"
                loading="lazy"
                className={cn('h-full w-full object-cover', imageClassName)}
            />
            <div className="absolute right-3 top-3 z-20 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-900/50 opacity-0 transition-all group-hover:opacity-100">
                <Expand className="w-4 text-white" />
            </div>
        </div>
    )
}
