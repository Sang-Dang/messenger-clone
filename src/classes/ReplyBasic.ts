export default class ReplyBasic {
    id: string // message id
    message: string // message content
    username: string
    userId: string
    type: ChatMessageTypes

    constructor(id: string, message: string, username: string, userId: string, type: ChatMessageTypes) {
        this.id = id
        this.message = message
        this.username = username
        this.userId = userId
        this.type = type
    }
}
