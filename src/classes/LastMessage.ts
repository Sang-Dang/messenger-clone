export default class LastMessage {
    id: string
    userId: string
    message: string

    constructor(id: string, userId: string, message: string) {
        this.id = id
        this.userId = userId
        this.message = message
    }
}
