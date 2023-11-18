import { toast } from '@/components/ui'
import { auth } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Outlet, useNavigate } from 'react-router-dom'

export default function ProtectedRoute() {
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)

    function goBack() {
        navigate(-1)
        toast({
            title: 'Error',
            description: 'You need to be logged in to access this page.',
            variant: 'destructive'
        })
    }

    if (loading) {
        // TODO add loading spinner
        return <div className="grid h-fullNoHeader w-full place-items-center">Loading...</div>
    }

    if (!user || error) {
        goBack()
    }

    return <Outlet />
}
