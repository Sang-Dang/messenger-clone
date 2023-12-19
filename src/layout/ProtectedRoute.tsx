import { toast } from '@/components/ui'
import { selectUserById } from '@/features/Users/UsersSelectors'
import { auth } from '@/firebase'
import useAppSelector from '@/lib/hooks/useAppSelector'
import useLoading from '@/lib/hooks/useLoading'
import { User } from 'firebase/auth'
import { createContext, useEffect } from 'react'
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
    const { handleOpen } = useLoading()
    const currentUser = useAppSelector(selectUserById(user?.uid ?? ''))

    // useEffect to avoid concurrent rendering of this and LoadingContext
    useEffect(() => {
        if (loading) {
            handleOpen(true)
        } else {
            handleOpen(false)
        }
    }, [handleOpen, loading])

    if (loading) {
        return
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
        <AuthContext.Provider
            value={{
                user: {
                    ...user!,
                    displayName: currentUser?.name ?? user.displayName,
                    email: currentUser?.email ?? user.email,
                    photoURL: currentUser?.avatar ?? user.photoURL
                }
            }}
        >
            <Outlet />
        </AuthContext.Provider>
    )
}
