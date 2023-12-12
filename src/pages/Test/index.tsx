import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function Test() {
    const divRef = useRef<HTMLButtonElement>(null)
    const isInView = useInView(divRef)

    useEffect(() => {
        if (isInView) {
            console.log('IN VIEW')
        }
    }, [isInView])

    // useEffect(() => {
    //     function onFocus() {
    //         console.log('FOCUS')
    //     }

    //     const ref = divRef.current
    //     ref?.addEventListener('mouseover', onFocus)

    //     return () => {
    //         ref?.removeEventListener('mouseover', onFocus)
    //     }
    // }, [])

    return (
        <div className="h-[5000px]">
            <div className="h-64 w-64 bg-red-500">Hello</div>
            <button ref={divRef}>BTN</button>
        </div>
    )
}
