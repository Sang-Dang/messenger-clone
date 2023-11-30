import LoadingSpinner from '@/components/LoadingSpinner'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, createContext, useState } from 'react'

type LoadingContextType = {
    handleOpen: (value: boolean) => void
}
export const LoadingContext = createContext<LoadingContextType>({
    handleOpen: () => {}
})

type LoadingContextProviderProps = {
    children: ReactNode
}
export default function LoadingContextProvider({ children }: LoadingContextProviderProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <LoadingContext.Provider
            value={{
                handleOpen: setIsOpen
            }}
        >
            {children}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-black/90"
                    >
                        <LoadingSpinner type="light" />
                    </motion.div>
                )}
            </AnimatePresence>
        </LoadingContext.Provider>
    )
}
