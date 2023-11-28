import { AuthContext } from '@/layout/ProtectedRoute'
import { useContext } from 'react'

export default function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within a Protected Route')
    }

    return context
}
