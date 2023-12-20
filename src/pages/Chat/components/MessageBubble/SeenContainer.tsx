import { selectUserInIdList } from '@/features/Users/UsersSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import { Avatar } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { memo } from 'react'
const MotionAvatar = motion(Avatar)

type SeenContainerProps = {
    userIds: string[]
    isSelf: boolean
}
const SeenContainer = memo(({ userIds, isSelf }: SeenContainerProps) => {
    const users = useAppSelector(selectUserInIdList(userIds))

    return (
        <div className={cn('flex justify-end gap-1', isSelf && 'flex-row-reverse justify-start')}>
            {users.slice(0, 4).map((user) => (
                <MotionAvatar
                    key={user.id}
                    src={user.avatar}
                    classNames={{
                        base: 'w-4 h-4'
                    }}
                    layoutId={`seen_avatar_${user.id}`}
                />
            ))}
            {users.length > 4 && (
                <div
                    className={cn(
                        'select-none rounded-full bg-neutral-200 px-1 py-[0.5px] text-xs'
                    )}
                >
                    +{users.length - 4}
                </div>
            )}
        </div>
    )
})

export default SeenContainer
