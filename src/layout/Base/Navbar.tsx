import TitleCard from '@/components/TitleCard'
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
    DropdownMenuTrigger,
    Skeleton,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui'
import { auth } from '@/firebase'
import LoginDialog from '@/layout/Base/LoginDialog'
import { Home, MessageCircle, User } from 'lucide-react'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [user, loading] = useAuthState(auth)
    const navigate = useNavigate()
    const location = useLocation()

    function handleSignout() {
        auth.signOut()
    }

    return (
        <div className="flex h-header w-full items-center justify-between border-b-2 border-b-neutral-300 bg-white px-8 text-neutral-800">
            <TitleCard />
            <nav className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={location.pathname === '/' ? 'secondary' : 'ghost'}
                                onClick={() => navigate('/')}
                            >
                                <Home />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent align="center" side="bottom">
                            Home
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={location.pathname === '/chat' ? 'secondary' : 'ghost'}
                                onClick={() => navigate('/chat')}
                            >
                                <MessageCircle />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent align="center" side="bottom">
                            Chat
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                                onClick={() => navigate('/profile')}
                            >
                                <User />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent align="center" side="bottom">
                            Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            {loading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={user.photoURL ?? ''} />
                            <AvatarFallback className="text-neutral-900">
                                {user.displayName?.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem
                            className="bg-red-500 text-neutral-100"
                            onClick={handleSignout}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <LoginDialog>
                    <Button>Sign In</Button>
                </LoginDialog>
            )}
        </div>
    )
}

export default Navbar
