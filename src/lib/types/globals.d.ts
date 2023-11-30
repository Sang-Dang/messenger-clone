export {}

declare global {
    type InputValue<TData> = {
        value: TData | undefined
        error: string | null
    }

    type FileInput = {
        file: File | undefined
        name: string | undefined
    }

    type UserActivity = 'active' | 'inactive'
}
