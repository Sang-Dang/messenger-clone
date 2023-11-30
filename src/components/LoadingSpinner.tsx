import { useAnimate, usePresence, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

type LoadingSpinnerProps = {
    type: 'dark' | 'light'
}
export default function LoadingSpinner({ type }: LoadingSpinnerProps) {
    const [isPresent, safeToRemove] = usePresence()
    const [scope, animate] = useAnimate()
    const [rotation, setRotation] = useState(0)
    const shouldReduceMotion = useReducedMotion()

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => prev + 45)
        }, 500)
        return () => {
            clearInterval(interval)
            setRotation(0)
        }
    }, [])

    const entranceAnimation = useCallback(async () => {
        if (!shouldReduceMotion) {
            await animate(scope.current, {
                scale: [0, 1],
                opacity: [0, 1]
            })
        }
    }, [animate, scope, shouldReduceMotion])

    useEffect(() => {
        if (isPresent) {
            entranceAnimation()
        }
    }, [entranceAnimation, isPresent, shouldReduceMotion])

    const spinAnimation = useCallback(async () => {
        await animate(
            scope.current,
            {
                rotate: rotation
            },
            {
                bounce: 10,
                ease: 'easeInOut',
                duration: 0.2
            }
        )
    }, [animate, rotation, scope])

    const exitAnimation = useCallback(async () => {
        if (!shouldReduceMotion) {
            await animate(scope.current, {
                rotate: 0,
                scale: 0.2,
                opacity: 0
            })
        }
        safeToRemove && safeToRemove()
    }, [animate, safeToRemove, scope, shouldReduceMotion])

    useEffect(() => {
        if (isPresent) {
            spinAnimation()
        } else {
            exitAnimation()
        }
    }, [spinAnimation, isPresent, exitAnimation])

    return (
        <img
            ref={scope}
            src={type === 'light' ? '/svg/light-logo-only-transparent.svg' : '/svg/dark-logo-only-transparent.svg'}
            alt="loading-spinner"
        />
    )
}
