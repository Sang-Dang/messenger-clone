import { User, UserConverter } from '@/classes/User'
import { Toaster } from '@/components/ui'
import { auth, db, rtdb } from '@/firebase'
import LoadingContextProvider from '@/lib/context/LoadingContext'
import useMobile from '@/lib/hooks/useMobile'
import { onDisconnect, ref, set } from 'firebase/database'
import { doc, setDoc } from 'firebase/firestore'
import { LucideComputer } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    const interval = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        return () => {
            if (auth.currentUser) {
                if (interval.current) {
                    clearInterval(interval.current)
                }
                onDisconnect(ref(rtdb, `users/${auth.currentUser.uid}`)).cancel()
                set(ref(rtdb, `users/${auth.currentUser.uid}`), { lastActive: new Date().toString(), activity: 'inactive' })
            }
        }
    }, [])

    const isMobile = useMobile()
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
        // update avatar for every logind
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

            if (!interval.current) {
                set(ref(rtdb, `users/${user.uid}`), { lastActive: new Date().toString(), activity: 'active' })
                interval.current = setInterval(
                    () => {
                        set(ref(rtdb, `users/${user.uid}`), { lastActive: new Date().toString(), activity: 'active' })
                    },
                    1000 * 60 * 5
                ) // 5 minutes
            }
            onDisconnect(ref(rtdb, `users/${user.uid}`)).set({ lastActive: new Date().toString(), activity: 'inactive' })
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
