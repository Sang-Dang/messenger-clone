import Navbar from '@/layout/Base/Navbar'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

export default function BaseLayout() {
    const MemoNavbar = memo(Navbar)

    return (
        <>
            <MemoNavbar />
            <Outlet />
        </>
    )
}
