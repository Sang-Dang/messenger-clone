import Navbar from '@/layout/Base/Navbar'
import React from 'react'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

export default function BaseLayout() {
    const MemoNavbar = memo(Navbar)

    return (
        <React.Fragment>
            <MemoNavbar />
            <Outlet />
        </React.Fragment>
    )
}
