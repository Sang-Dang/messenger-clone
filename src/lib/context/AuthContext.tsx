import { auth } from '@/firebase'
import { User } from 'firebase/auth'
import { createContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

type AuthContextType = {
    user: User | null | undefined
    loading: boolean
    error: Error | undefined
}
export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: undefined
})

type AuthContextProviderProps = {
    children: React.ReactNode
}
export default function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, loading, error] = useAuthState(auth)

    return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>
}
