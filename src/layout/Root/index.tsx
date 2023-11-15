import { Toaster } from '@/components/ui'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    console.log('RENDER')

    // providers go here

    return (
        <>
            <Toaster />
            <Outlet />
        </>
    )
}
