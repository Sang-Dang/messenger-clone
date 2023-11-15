import { ChatLog } from '@/classes/ChatLog'
import { ChatMetadata } from '@/classes/ChatMetadata'
import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export class ChatRoom {
    id: string
    metadata: ChatMetadata
    chatLogs: ChatLog[]

    constructor(id: string, metadata: ChatMetadata, chatLogs: ChatLog[]) {
        this.id = id
        this.metadata = metadata
        this.chatLogs = chatLogs
    }
}

export const ChatRoomConverter = {
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const metadata = snapshot.data(options).metadata
        const id = snapshot.id
        return new ChatRoom(id, new ChatMetadata(metadata.user1, metadata.user2, metadata.createdOn, metadata.lastUpdatedOn), [])
    },
    toFirestore: (chatRoom: ChatRoom) => {
        return {
            metadata: chatRoom.metadata
        }
    }
}
