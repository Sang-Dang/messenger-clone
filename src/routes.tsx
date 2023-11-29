import ProtectedRoute from '@/layout/ProtectedRoute'
import BaseLayout from '@/layout/Base'
import RootLayout from '@/layout/Root'
import Home from '@/pages/Home'
import Test from '@/pages/Test'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import ChatPage from '@/pages/Chat'
import Profile from '@/pages/Profile'

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout />}>
            <Route element={<BaseLayout />}>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>
            <Route path="/test" element={<Test />} />
        </Route>
    )
)

export default routes
