import { useState, useEffect } from 'react'

const MOBILE_WIDTH = 928

export default function useMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_WIDTH)

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= MOBILE_WIDTH)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return isMobile
}
