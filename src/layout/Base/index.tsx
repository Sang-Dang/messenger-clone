import Navbar from '@/layout/Base/Navbar'
import { Outlet } from 'react-router-dom'

export default function BaseLayout() {
    console.log('RENDER')

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}
