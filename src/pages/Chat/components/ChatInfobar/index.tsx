import {
    SelectChatInfobarOpenState,
    SelectConversationChatId
} from '@/features/Conversation.ts/ConversationSelectors'
import useAppSelector from '@/lib/hooks/useAppSelector'
import ChatInfobarHeader from '@/pages/Chat/components/ChatInfobar/ChatInfobarHeader'
import { Accordion, AccordionItem, Button } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Ban, BellOff, Search, User, AlertTriangle } from 'lucide-react'

export default function ChatInfoBar() {
    const isOpen = useAppSelector(SelectChatInfobarOpenState)
    const chatId = useAppSelector(SelectConversationChatId)

    return (
        <AnimatePresence mode="popLayout" presenceAffectsLayout>
            {isOpen && chatId && (
                <motion.div
                    initial={{ x: 500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 500, opacity: 0 }}
                    transition={{
                        bounce: 0,
                        ease: 'easeInOut'
                    }}
                    className="flex h-full w-[700px] flex-col border-l-1 border-l-neutral-300 bg-white p-10"
                >
                    <ChatInfobarHeader chatId={chatId} />
                    <div className="mb-6 mt-12 flex justify-between px-20">
                        <div className="flex flex-col items-center">
                            <Button
                                variant="flat"
                                isIconOnly
                                radius="full"
                                className="p-[6px]"
                                size="sm"
                            >
                                <User />
                            </Button>
                            <div className="mt-1 text-center text-sm">Profile</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Button
                                variant="flat"
                                isIconOnly
                                radius="full"
                                className="p-[6px]"
                                size="sm"
                            >
                                <Ban />
                            </Button>
                            <div className="mt-1 text-center text-sm">Mute</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <Button
                                variant="flat"
                                isIconOnly
                                radius="full"
                                className="p-[6px]"
                                size="sm"
                            >
                                <Search />
                            </Button>
                            <div className="mt-1 text-center text-sm">Search</div>
                        </div>
                    </div>
                    <Accordion
                        selectionMode="multiple"
                        showDivider={false}
                        variant="light"
                        fullWidth
                        className=""
                    >
                        <AccordionItem
                            key="1"
                            title="Chat Info"
                            classNames={{
                                trigger:
                                    'py-2 hover:bg-neutral-200 transition-all rounded-lg px-2 font-semibold',
                                content: 'px-2'
                            }}
                        >
                            <Button
                                fullWidth
                                variant="light"
                                className="border-none text-left text-black hover:bg-neutral-200"
                                color="primary"
                                radius="sm"
                            >
                                <div className="flex w-full items-center gap-3 text-left text-medium font-semibold">
                                    <BellOff className="rounded-full bg-neutral-200 p-[2px]" />
                                    View pinned messages
                                </div>
                            </Button>
                        </AccordionItem>
                        <AccordionItem
                            key="2"
                            title="Customize Chat"
                            classNames={{
                                trigger:
                                    'py-2 hover:bg-neutral-200 transition-all rounded-lg px-2 font-semibold',
                                content: 'px-2'
                            }}
                        >
                            Customize CHAT
                        </AccordionItem>
                        <AccordionItem
                            key="3"
                            title="Media"
                            classNames={{
                                trigger:
                                    'py-2 hover:bg-neutral-200 transition-all rounded-lg px-2 font-semibold',
                                content: 'px-2'
                            }}
                        >
                            MEDIA
                        </AccordionItem>
                        <AccordionItem
                            key="4"
                            title="Privacy and Support"
                            classNames={{
                                trigger:
                                    'py-2 hover:bg-neutral-200 transition-all rounded-lg px-2 font-semibold',
                                content: 'px-2'
                            }}
                        >
                            <Button
                                fullWidth
                                variant="ghost"
                                className="border-none bg-transparent text-left"
                            >
                                <div className="flex w-full items-center gap-3 text-left text-medium font-semibold">
                                    <BellOff className="rounded-full bg-neutral-200 p-[2px]" />
                                    Mute Notifications
                                </div>
                            </Button>
                            <Button
                                fullWidth
                                variant="ghost"
                                className="border-none bg-transparent text-left"
                            >
                                <div className="flex w-full items-center gap-3 text-left text-medium font-semibold">
                                    <Ban className="rounded-full bg-neutral-200 p-[2px]" />
                                    Block
                                </div>
                            </Button>
                            <Button
                                fullWidth
                                variant="ghost"
                                className="border-none bg-transparent text-left"
                            >
                                <div className="flex w-full items-center gap-3 text-left text-medium font-semibold">
                                    <AlertTriangle className="rounded-full bg-neutral-200 p-[2px]" />
                                    Report
                                </div>
                            </Button>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
