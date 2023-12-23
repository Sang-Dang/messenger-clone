import { User, UserConverter } from '@/classes/User'
import UserActivity from '@/classes/UserActivity'
import { Toaster } from '@/components/ui'
import { fetchUsers } from '@/features/Users/UsersThunks'
import { auth, db, storage } from '@/firebase'
import LoadingContextProvider from '@/lib/context/LoadingContext'
import SlowDownPopup from '@/lib/dialogs/SlowDownPopup'
import useAppDispatch from '@/lib/hooks/useAppDispatch'
import useMobile from '@/lib/hooks/useMobile'
import { NextUIProvider } from '@nextui-org/react'
import { doc, runTransaction, setDoc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { LucideComputer } from 'lucide-react'
import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    const isMobile = useMobile()
    const dispatch = useAppDispatch()
    const userActivityRef = useRef<UserActivity | null>(null)
    const [open, setOpen] = useState(true)
    if (isMobile) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-red-500">
                <LucideComputer size={150} color="white" className="mb-10" />
                <h1 className="text-center text-3xl font-bold text-white">
                    Please use this app on your desktop!
                </h1>
                <p className="mt-3 w-8/12 text-center text-sm font-light text-white">
                    We don't like mobile users, and you don't deserve to use this application.
                </p>
            </div>
        )
    }

    auth.onAuthStateChanged(async function (user) {
        // update avatar for every login
        if (user) {
            const avatarUrl = `userAvatars/${user.uid}`
            let isFirstLogin = false
            await runTransaction(db, async (transaction) => {
                const docRef = doc(db, 'users', user.uid).withConverter(UserConverter)
                const docSnap = await transaction.get(docRef)

                if (!docRef || !docSnap.exists()) {
                    isFirstLogin = true
                    await setDoc(docRef, {
                        ...new User(
                            user.uid,
                            user.displayName ?? '',
                            user.email ?? '',
                            user.metadata.lastSignInTime ?? new Date().toString(),
                            avatarUrl,
                            undefined
                        )
                    })
                }
            })

            if (isFirstLogin && user.photoURL) {
                const response = await fetch(user.photoURL)
                const blob = await response.blob()

                const storageRef = ref(storage, avatarUrl)
                await uploadBytes(storageRef, blob)
            }

            // update last active
            const userActivity = new UserActivity(user.uid)
            userActivity.online()
            userActivityRef.current = userActivity

            dispatch(fetchUsers([user.uid]))
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
            <NextUIProvider>
                <LoadingContextProvider>
                    <Toaster />
                    <Outlet />
                    <SlowDownPopup open={open} setOpen={setOpen} />
                </LoadingContextProvider>
            </NextUIProvider>
        </>
    )
}
