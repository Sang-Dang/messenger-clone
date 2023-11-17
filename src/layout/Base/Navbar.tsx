import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui'
import { auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    function handleSignin() {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
    }

    function handleSignout() {
        auth.signOut()
    }

    return (
        <div className="text- flex h-header w-full items-center justify-between bg-primary px-8 text-neutral-200">
            <h1 className="text-2xl font-extrabold tracking-wider">CHUNT</h1>
            <nav className="flex gap-5">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    Home
                </Button>
                <Button variant="ghost" onClick={() => navigate('/chat')}>
                    Chat
                </Button>
                <Button variant="ghost" onClick={() => navigate('/profile')}>
                    My Profile
                </Button>
            </nav>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user.photoURL ?? ''} />
                            <AvatarFallback className="text-neutral-900">US</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem className="bg-red-500 text-neutral-100" onClick={handleSignout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button onClick={handleSignin}>Sign In</Button>
            )}
        </div>
    )
}

export default Navbar
