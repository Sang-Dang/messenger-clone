import { Timestamp } from 'firebase/firestore'

export class ChatLog {
    message: string
    user: string
    createdOn: Timestamp

    constructor(message: string, user: string, createdOn: Timestamp) {
        this.message = message
        this.user = user
        this.createdOn = createdOn
    }
}
