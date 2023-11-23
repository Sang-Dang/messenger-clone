import { Toaster } from '@/components/ui'
import AuthContextProvider from '@/lib/context/AuthContext'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    // providers go here

    return (
        <>
            <AuthContextProvider>
                <Toaster />
                <Outlet />
            </AuthContextProvider>
        </>
    )
}
