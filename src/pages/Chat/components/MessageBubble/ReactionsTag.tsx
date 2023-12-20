import { Reactions } from '@/classes/Message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { selectUserInIdListObject } from '@/features/Users/UsersSelectors'
import { usersObj } from '@/features/Users/UsersSlice'
import useAppSelector from '@/lib/hooks/useAppSelector'
import { cn } from '@/lib/utils'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Tab,
    Tabs,
    Tooltip,
    useDisclosure
} from '@nextui-org/react'
import { Fragment } from 'react'

export type ReactionsTagType = {
    className?: string
    reactions: Reactions
}
export function ReactionsTag({ className, reactions }: ReactionsTagType) {
    // object for easy retrieval (better than linear search with array)
    const users = useAppSelector(selectUserInIdListObject(Object.keys(reactions.data))) // Object {[ID: string]: User}. see UsersObj in UsersSlice
    const allUsers = Object.values(users)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const uniqueReactions = Array.from(new Set(Object.values(reactions.data)))

    return (
        <>
            <Tooltip
                content={
                    <>
                        {allUsers.slice(0, 5).map((u, index) => (
                            <div key={index}>{u.name}</div>
                        ))}
                        {allUsers.length > 5 && <div>...</div>}
                    </>
                }
                delay={500}
                classNames={{
                    content: 'flex flex-col'
                }}
            >
                <div
                    onClick={onOpen}
                    className={cn(
                        'flex h-6 w-max cursor-pointer items-center rounded-3xl bg-white px-1 text-sm',
                        className
                    )}
                    style={{
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px 0px'
                    }}
                >
                    {uniqueReactions.map((react) => (
                        <Fragment key={react}>{react}</Fragment>
                    ))}
                    {Object.keys(reactions.data).length > 1 && (
                        <div className="p-1 text-xs font-semibold text-neutral-700">
                            {Object.keys(reactions.data).length}
                        </div>
                    )}
                </div>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>Message Reactions</ModalHeader>
                    <ModalBody>
                        <Tabs aria-label="options" fullWidth>
                            <Tab
                                title={
                                    <div className="flex items-center gap-2">
                                        <span>All</span>
                                        <span>{Object.values(reactions.data).length}</span>
                                    </div>
                                }
                            >
                                <ReactionTab reactions={reactions.data} users={users} />
                            </Tab>
                            {uniqueReactions.map((reaction) => (
                                <Tab
                                    key={reaction}
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span>{reaction}</span>
                                            <span>
                                                {Object.values(reactions.data).reduce(
                                                    (prev, curr) =>
                                                        (prev = prev + (curr === reaction ? 1 : 0)),
                                                    0
                                                )}
                                            </span>
                                        </div>
                                    }
                                >
                                    <ReactionTab
                                        reactions={reactions.data}
                                        users={users}
                                        filter={reaction}
                                    />
                                </Tab>
                            ))}
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

type ReactionTabType = {
    reactions: {
        [userId: string]: string
    }
    users: usersObj
    filter?: string
}
function ReactionTab({ reactions, users, filter }: ReactionTabType) {
    if (filter) {
        reactions = Object.entries(reactions)
            .filter(([, value]) => value === filter)
            .map(([userId, reaction]) => ({ [userId]: reaction }))
            .reduce((prev, curr) => ({ ...prev, ...curr }), {})
    }

    return (
        <div className="flex flex-col gap-2">
            {Object.entries(reactions).map(([userId, reaction]) => {
                const currentUser = users[userId]

                if (!currentUser) return null

                return (
                    <div
                        key={userId}
                        className="flex w-full items-center rounded-2xl bg-neutral-100 p-3 transition-all hover:bg-neutral-200"
                    >
                        <Avatar>
                            <AvatarImage src={currentUser.avatar} alt="avatar"></AvatarImage>
                            <AvatarFallback>{currentUser.name}</AvatarFallback>
                        </Avatar>
                        <h5 className="ml-3 flex-grow text-lg font-semibold">{currentUser.name}</h5>
                        <div className="text-2xl">{reaction}</div>
                    </div>
                )
            })}
        </div>
    )
}
