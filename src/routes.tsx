/* eslint-disable react-refresh/only-export-components */
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { lazy } from 'react'

const BaseLayout = lazy(() => import('@/layout/Base'))
const RootLayout = lazy(() => import('@/layout/Root'))
const ProtectedRoute = lazy(() => import('@/layout/ProtectedRoute'))
const Home = lazy(() => import('@/pages/Home'))
const Test = lazy(() => import('@/pages/Test'))
const ChatPage = lazy(() => import('@/pages/Chat'))

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout />}>
            <Route element={<BaseLayout />}>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/chat" element={<ChatPage />} />
                </Route>
            </Route>
            <Route path="/test" element={<Test />} />
        </Route>
    )
)

export default routes
