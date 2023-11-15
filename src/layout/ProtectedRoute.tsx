import { toast } from '@/components/ui'
import { auth } from '@/firebase'
import { Outlet, useNavigate } from 'react-router-dom'

export default function ProtectedRoute() {
    const navigate = useNavigate()

    function goBack() {
        navigate('/', {
            replace: true
        })
        toast({
            title: 'Error',
            description: 'You need to be logged in to access this page.',
            variant: 'destructive'
        })
    }

    auth.onAuthStateChanged((user) => {
        if (!user) {
            goBack()
        }
    })

    if (!auth.currentUser) {
        goBack()
    }

    return <Outlet />
}
