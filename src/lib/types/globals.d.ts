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
    type RT_UserActivity = {
        activity: UserActivity
        lastActive: string
    }
    type UserActivityObj = {
        activity: UserActivity
        lastActive: Date
    }

    type ChatMessageTypes = 'text' | 'image'

    type ChatResponse = {
        id: string
        userId: string
        message: string
        name: string
        type: ChatMessageTypes
    }
}
