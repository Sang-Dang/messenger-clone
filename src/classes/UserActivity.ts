import { rtdb } from '@/firebase'
import IntervalManager from '@/classes/IntervalManager'
import { onDisconnect, ref, set } from 'firebase/database'

const DEFAULT_INTERVAL_TIME = 1000 * 60 * 5 // 5 minutes

export default class UserActivity {
    userId: string
    interval: NodeJS.Timeout | null

    constructor(userId: string) {
        this.userId = userId
        this.interval = null
        onDisconnect(ref(rtdb, `users/${userId}`)).set({
            activity: 'inactive',
            lastActive: new Date().toString()
        })
    }

    public online() {
        IntervalManager.getInstance().clearInterval(this.interval)
        set(ref(rtdb, `users/${this.userId}`), {
            activity: 'active',
            lastActive: new Date().toString()
        })
        this.interval = IntervalManager.getInstance().setInterval(() => {
            set(ref(rtdb, `users/${this.userId}`), {
                activity: 'active',
                lastActive: new Date().toString()
            })
        }, DEFAULT_INTERVAL_TIME)
    }

    public offline() {
        IntervalManager.getInstance().clearInterval(this.interval)
        set(ref(rtdb, `users/${this.userId}`), {
            activity: 'inactive',
            lastActive: new Date().toString()
        })
        this.interval = null
    }
}
