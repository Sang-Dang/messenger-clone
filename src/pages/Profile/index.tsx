import { Separator } from '@/components/ui'
import useAuth from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import ProfileCard from '@/pages/Profile/ProfileCard'
import { Avatar, Button } from '@nextui-org/react'
import { Pen } from 'lucide-react'
import styles from './styles.module.css'

export default function Profile() {
    const { user } = useAuth()
    return (
        <div className={cn('relative')}>
            <div className={cn('relative shadow-xl', styles.profile_grid)}>
                <div
                    className={cn(
                        'grid h-[450px] place-items-center rounded-b-lg bg-slate-800 text-white',
                        styles.profile_grid_inner
                    )}
                >
                    IMAGE PLACEHOLDER
                </div>
                <div
                    className={cn(
                        'flex h-min -translate-y-12 gap-4 text-black',
                        styles.profile_grid_content
                    )}
                >
                    <Avatar className="h-36 w-36" src={user.photoURL ?? undefined} isBordered />
                    <div className="flex flex-grow flex-col-reverse gap-1 pb-4">
                        <p>{user.email}</p>
                        <h4 className="text-3xl font-bold">{user.displayName}</h4>
                    </div>
                    <div className="flex items-end pb-4">
                        <Button className="text-base" variant="flat">
                            <Pen size={16} fill="black" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
                <div className={cn(styles.profile_grid_content)}>
                    <Separator />
                </div>
                <nav className={cn('mt-3 flex gap-3', styles.profile_grid_content)}>
                    <Button variant="flat" radius="none">
                        Posts
                    </Button>
                    <Button variant="flat" radius="none">
                        About
                    </Button>
                </nav>
            </div>
            <div className={cn('h-full bg-neutral-100 py-10', styles.profile_grid)}>
                <div className={cn('grid grid-cols-2 gap-3', styles.profile_grid_content)}>
                    <div className="flex flex-col gap-3">
                        <ProfileCard>
                            <ProfileCard.Title>Intro</ProfileCard.Title>
                        </ProfileCard>
                        <ProfileCard>
                            <ProfileCard.Title>About</ProfileCard.Title>
                        </ProfileCard>
                        <ProfileCard>
                            <ProfileCard.Title>Friends</ProfileCard.Title>
                        </ProfileCard>
                    </div>
                    <div className="flex flex-col gap-3">
                        <ProfileCard className="flex items-center gap-3 p-5">
                            <Avatar src={user.photoURL ?? undefined} isBordered />
                            <Button variant="solid" fullWidth>
                                <div className="w-full text-left text-base">
                                    What's on your mind?
                                </div>
                            </Button>
                        </ProfileCard>
                        <ProfileCard>
                            <ProfileCard.Title>Posts</ProfileCard.Title>
                        </ProfileCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
