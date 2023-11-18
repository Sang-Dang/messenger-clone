import { useState } from 'react'

export default function useRefresh() {
    const setRefresh = useState(0)[1]

    function refresh() {
        setRefresh((prev) => prev + 1)
    }

    return refresh
}
