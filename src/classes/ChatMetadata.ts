import { Timestamp } from 'firebase/firestore'

export class ChatMetadata {
    user1: string
    user2: string
    createdOn: Timestamp
    lastUpdatedOn: Timestamp

    constructor(user1id: string, user2id: string, createdOn: Timestamp, lastUpdatedOn: Timestamp) {
        this.user1 = user1id
        this.user2 = user2id
        this.createdOn = createdOn
        this.lastUpdatedOn = lastUpdatedOn
    }
}
