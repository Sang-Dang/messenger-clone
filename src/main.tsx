import { Analytics } from '@vercel/analytics/react'
import routes from '@/routes'
import { store } from '@/store'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Analytics />
        <Provider store={store}>
            <RouterProvider router={routes} />
        </Provider>
    </React.StrictMode>
)
