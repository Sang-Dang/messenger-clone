import { Toaster } from '@/components/ui'
import LoadingContextProvider from '@/lib/context/LoadingContext'
import { LucideComputer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 768) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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
