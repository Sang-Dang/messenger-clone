import { toast } from '@/components/ui'
import { auth } from '@/firebase'
import { User } from 'firebase/auth'
import { createContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Outlet, useNavigate } from 'react-router-dom'

type AuthContextType =
    | {
          user: User
      }
    | undefined
export const AuthContext = createContext<AuthContextType>(undefined)

export default function ProtectedRoute() {
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)

    if (loading) {
        // TODO add loading spinner
        return 'Loading...'
    }

    if (!user || error) {
        navigate('/', {
            replace: true
        })
        toast({
            title: 'Error',
            description: 'You need to be logged in to access this page.',
            variant: 'destructive'
        })
        return
    }

    return (
        <AuthContext.Provider value={{ user: user! }}>
            <Outlet />
        </AuthContext.Provider>
    )
}
