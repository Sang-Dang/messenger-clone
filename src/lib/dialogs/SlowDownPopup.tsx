import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { Github } from 'lucide-react'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

export default function SlowDownPopup({ open, setOpen }: Props) {
    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            <ModalContent className="p-3">
                <ModalHeader className="text-2xl">WELCOME TO CHUNT! 🎇</ModalHeader>
                <ModalBody>
                    <h1 className="font-bold">V0.5: We just added many fun features!</h1>
                    <ul>
                        <li className="list-disc">
                            You can now see if your partner has seen a text message!
                        </li>
                        <li className="list-disc">
                            Website loading should be 5 times faster since we've cached everything.
                        </li>
                    </ul>
                    <div className="group relative mt-3">
                        {/* <Smile className="absolute right-0 top-0 z-0 size-5 rotate-45 transition-all group-hover:right-[94%] group-hover:top-[90%] group-hover:size-10" />
                        <Microscope className="absolute right-0 top-0 z-0 size-5 rotate-45 transition-all group-hover:right-[50%] group-hover:top-[92%] group-hover:size-10" /> */}
                        <p className="relative z-10 select-none rounded-xl bg-neutral-100 p-4 shadow-lg transition-all group-hover:bg-purple-700 group-hover:text-white group-hover:shadow-2xl">
                            Please, however, be careful with the messages, and the seen feature. I'm
                            only using the free version of firebase, so backend glitches might occur
                            due to throttling on firebase. If you see any errors,{' '}
                            <strong>please report them to me on github!</strong> 🥹
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() =>
                            (window.location.href = 'https://github.com/Sang-Dang/simple-chat')
                        }
                        isIconOnly
                    >
                        <Github />
                    </Button>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
