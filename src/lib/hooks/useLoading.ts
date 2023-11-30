import { LoadingContext } from '@/lib/context/LoadingContext'
import { useContext } from 'react'

export default function useLoading() {
    const context = useContext(LoadingContext)

    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }

    return context
}
