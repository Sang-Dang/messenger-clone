import { Button, Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui'
import { ReactNode, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup, OAuthProvider } from 'firebase/auth'
import { auth } from '@/firebase'

type Props = {
    children: ReactNode
}

export default function LoginDialog({ children }: Props) {
    const [open, setOpen] = useState(false)

    function handleSigninGoogle() {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
        setOpen(false)
    }

    function handleSigninMicrosoft() {
        const provider = new OAuthProvider('microsoft.com')
        signInWithPopup(auth, provider)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <h1 className="text-2xl font-bold">Login</h1>
                </DialogHeader>
                <Button className="w-full" onClick={handleSigninGoogle}>
                    Google
                </Button>
                <Button className="w-full" onClick={handleSigninMicrosoft}>
                    Microsoft
                </Button>
            </DialogContent>
        </Dialog>
    )
}
