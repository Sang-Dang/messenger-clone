import { AuthContext } from '@/lib/context/AuthContext'
import { useContext } from 'react'

export default function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within a AuthProvider')
    }

    return context
}
