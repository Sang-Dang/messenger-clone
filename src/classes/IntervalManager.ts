export default class IntervalManager {
    private static instance: IntervalManager
    private intervalList: Set<NodeJS.Timeout>

    private constructor() {
        this.intervalList = new Set()
    }

    public static getInstance(): IntervalManager {
        if (!IntervalManager.instance) {
            IntervalManager.instance = new IntervalManager()
        }
        return IntervalManager.instance
    }

    public setInterval(callback: () => void, delay: number): NodeJS.Timeout {
        const interval = setInterval(callback, delay)
        this.intervalList.add(interval)
        return interval
    }

    public clearInterval(interval: NodeJS.Timeout | null): void {
        if (!interval) return
        clearInterval(interval)
        this.intervalList.delete(interval)
    }

    public clearAll(): void {
        this.intervalList.forEach((interval) => clearInterval(interval))
        this.intervalList.clear()
    }
}
