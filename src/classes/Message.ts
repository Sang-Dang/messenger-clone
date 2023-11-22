import { QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore'

export class Message {
    id: string
    userId: string
    message: string
    createdOn: string

    constructor(id: string, userId: string, message: string, createdOn: string) {
        this.id = id
        this.userId = userId
        this.message = message
        this.createdOn = createdOn
    }
}

export const MessageConverter = {
    toFirestore: (message: Message) => {
        return {
            userId: message.userId,
            message: message.message,
            createdOn: Timestamp.fromDate(new Date(message.createdOn))
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        return new Message(id, data.userId, data.message, (data.createdOn as Timestamp).toDate().toString())
    }
}
