import { ToggleReaction } from '@/api/messages/ToggleReaction'
import { Message } from '@/classes/Message'
import ReactionSelector from '@/components/ReactionSelector'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { SelectChatId } from '@/features/Messages/MessagesSelectors'
import { selectUserById, selectUserInIdList } from '@/features/Users/UsersSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import useReply from '@/pages/Chat/hooks/useResponse'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { MoreVertical, Reply, Smile } from 'lucide-react'

type MessageOptionsProps = {
    isHovered: boolean
    isSelf: boolean
    data: Message
    handleDeleteMessage: (messageId: string) => void
}
export default function MessageOptions({
    isHovered,
    isSelf,
    data,
    handleDeleteMessage
}: MessageOptionsProps) {
    const { setReply } = useReply()
    const { user } = useAuth()
    const chatId = useAppSelector(SelectChatId)
    const sender = useAppSelector(selectUserById(data.userId))

    function handleReaction(reaction: string) {
        if (chatId) {
            ToggleReaction(chatId, data.id, user.uid, reaction)
        }
    }

    if (!sender) {
        console.error('Sender not found')
        return
    }

    return (
        <AnimatePresence>
            {isHovered && data.type !== 'deleted' && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9
                    }}
                    className={cn('flex items-center gap-1', isSelf && 'flex-row-reverse')}
                >
                    <ReactionSelector handleSelectReaction={handleReaction}>
                        <Button
                            variant="solid"
                            isIconOnly
                            color="secondary"
                            className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                            disableRipple
                        >
                            <Smile size={16} />
                        </Button>
                    </ReactionSelector>
                    <Button
                        variant="solid"
                        color="secondary"
                        isIconOnly
                        disableRipple
                        className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                        onClick={() =>
                            setReply({
                                message: data.message,
                                username: sender.name,
                                userId: sender.id,
                                type: data.type,
                                id: data.id
                            })
                        }
                    >
                        <Reply size={16} />
                    </Button>
                    <Popover placement="top" showArrow>
                        <PopoverTrigger>
                            <Button
                                variant="solid"
                                isIconOnly
                                color="secondary"
                                className="grid aspect-square h-8 w-8 min-w-0 place-items-center p-0"
                                disableRipple
                            >
                                <MoreVertical size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex gap-3 p-2">
                            <div className="flex gap-2 whitespace-pre-wrap">
                                <div>Seen by</div>
                                <SeenContainer seen={data.seenBy} />
                            </div>
                            {isSelf && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    color="danger"
                                    onClick={() => handleDeleteMessage(data.id)}
                                >
                                    Remove
                                </Button>
                            )}
                        </PopoverContent>
                    </Popover>
                    <div className={cn('w-max text-xs font-light', isSelf ? 'mr-3' : 'ml-3    ')}>
                        {format(new Date(data.createdOn), 'dd/MM/yyyy HH:mm:ss')}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

type SeenContainerProps = {
    seen: string[]
}
function SeenContainer({ seen }: SeenContainerProps) {
    const seenList = useAppSelector(selectUserInIdList(seen))

    return (
        <div className="flex items-center justify-end">
            {seenList.map((user) => (
                <Avatar key={user.id} className="aspect-square h-4 w-4">
                    <AvatarImage src={user.avatar} alt="avatar" className="h-full w-full" />
                    <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
            ))}
        </div>
    )
}
