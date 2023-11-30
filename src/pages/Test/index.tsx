import LoadingSpinner from '@/components/LoadingSpinner'
import { Switch } from '@/components/ui'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Test() {
    const [show, setShow] = useState(false)

    return (
        <>
            <Switch checked={show} onCheckedChange={setShow} />
            <AnimatePresence>{show ? <LoadingSpinner type="dark" className="w-10" /> : null}</AnimatePresence>
        </>
    )
}
