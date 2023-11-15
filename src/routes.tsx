import ProtectedRoute from '@/layout/ProtectedRoute'
import BaseLayout from '@/layout/Base'
import RootLayout from '@/layout/Root'
import Chat from '@/pages/Chat'
import Home from '@/pages/Home'
import Test from '@/pages/Test'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout />}>
            <Route element={<BaseLayout />}>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/chat" element={<Chat />} />
                </Route>
            </Route>
            <Route path="/test" element={<Test />} />
        </Route>
    )
)

export default routes
