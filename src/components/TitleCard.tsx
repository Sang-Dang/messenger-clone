import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Variants, motion } from 'framer-motion'

const APP_NAME = 'CHUNT'
const colorList = [
    'rgb(255, 5, 5)', // Red
    'rgb(124, 198, 19)', // Green
    'rgb(42, 107, 255)', // Blue
    'rgb(170, 68, 204)', // Purple
    'rgb(255, 140, 0)', // Orange
    'rgb(0, 128, 0)', // Dark Green
    'rgb(255, 0, 255)', // Magenta
    'rgb(0, 0, 128)', // Navy
    'rgb(255, 255, 0)', // Yellow
    'rgb(0, 255, 255)', // Cyan
    'rgb(82, 190, 128)', // Mint Green
    'rgb(255, 69, 0)', // Red-Orange
    'rgb(128, 0, 128)', // Purple
    'rgb(30, 144, 255)', // Dodger Blue
    'rgb(255, 215, 0)', // Gold
    'rgb(0, 139, 139)', // Dark Cyan
    'rgb(255, 99, 71)', // Tomato
    'rgb(70, 130, 180)', // Steel Blue
    'rgb(240, 128, 128)', // Light Coral
    'rgb(0, 128, 128)' // Teal
]

export default function TitleCard() {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)
    const [currentElement, setCurrentElement] = useState(-1)
    const [currentRotation, setCurrentRotation] = useState(0)

    useEffect(() => {
        if (isHovered) {
            setCurrentElement(-1)
            const interval = setInterval(() => {
                setCurrentElement((prev) => (prev + 1) % APP_NAME.length)
            }, 400)

            const imageInterval = setInterval(() => {
                setCurrentRotation((prev) => prev + 45)
            }, 600)

            return () => {
                clearInterval(interval)
                clearInterval(imageInterval)
            }
        } else {
            setCurrentElement(-1)
            setCurrentRotation(0)
        }
    }, [isHovered])

    const textVariants: Variants = {
        idle: {},
        hover: {
            scale: 1.2,
            color: colorList[Math.floor(Math.random() * colorList.length)]
        }
    }

    const imageVariants: Variants = {
        idle: {},
        hover: {
            scale: 1.1,
            rotate: currentRotation,
            transition: {
                duration: 0.2
            }
        }
    }

    return (
        <h1
            className="flex cursor-pointer items-center gap-1"
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/')}
        >
            <motion.img
                variants={imageVariants}
                animate={isHovered ? 'hover' : 'idle'}
                src="/svg/light-logo-only-transparent.svg"
                alt="Chunt"
                height={50}
                width={50}
                className="h-50 w-50 object-cover transition-all"
            />
            <div className="flex text-2xl font-extrabold tracking-wider">
                {APP_NAME.split('').map((letter, index) => (
                    <motion.p variants={textVariants} animate={currentElement === index ? 'hover' : 'idle'} key={letter + '' + index}>
                        {letter}
                    </motion.p>
                ))}
            </div>
        </h1>
    )
}
