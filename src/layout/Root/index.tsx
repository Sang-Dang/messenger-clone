import { User, UserConverter } from '@/classes/User'
import UserActivity from '@/classes/UserActivity'
import { Toaster } from '@/components/ui'
import { auth, db } from '@/firebase'
import LoadingContextProvider from '@/lib/context/LoadingContext'
import useMobile from '@/lib/hooks/useMobile'
import { doc, setDoc } from 'firebase/firestore'
import { LucideComputer } from 'lucide-react'
import { useRef } from 'react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    const isMobile = useMobile()
    const userActivityRef = useRef<UserActivity | null>(null)
    if (isMobile) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-red-500">
                <LucideComputer size={150} color="white" className="mb-10" />
                <h1 className="text-center text-3xl font-bold text-white">Please use this app on your desktop!</h1>
                <p className="mt-3 w-8/12 text-center text-sm font-light text-white">
                    We don't like mobile users, and you don't deserve to use this application.
                </p>
            </div>
        )
    }

    auth.onAuthStateChanged(function (user) {
        // update avatar for every login
        if (user) {
            const docRef = doc(db, 'users', user.uid).withConverter(UserConverter)
            setDoc(
                docRef,
                new User(
                    user.uid,
                    user.displayName ?? '',
                    user.email ?? '',
                    user.metadata.lastSignInTime ?? new Date().toString(),
                    user.photoURL ?? undefined
                )
            )

            // update last active
            const userActivity = new UserActivity(user.uid)
            userActivity.online()
            userActivityRef.current = userActivity
        }
    })

    auth.onAuthStateChanged(function (user) {
        if (!user) {
            userActivityRef.current?.offline()
            userActivityRef.current = null
        }
    })

    // providers go here

    return (
        <>
            <LoadingContextProvider>
                <Toaster />
                <Outlet />
            </LoadingContextProvider>
        </>
    )
}
