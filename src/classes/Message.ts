import ReplyBasic from '@/classes/ReplyBasic'
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore'

export type reactionsType = {
    data: {
        [userid: string]: string
    }
    count: {
        [reaction: string]: number
    }
}

export class Message {
    id: string
    userId: string
    message: string
    createdOn: string
    type: ChatMessageTypes
    deletedOn: string | null = null
    replyIds: string[] = []
    repliedTo: ReplyBasic | null = null
    reactions: reactionsType

    constructor(
        id: string,
        userId: string,
        message: string,
        createdOn: string,
        type: ChatMessageTypes,
        deletedOn: string | null = null,
        replies: string[] = [],
        repliedTo: ReplyBasic | null = null,
        reactions?: reactionsType
    ) {
        this.id = id
        this.userId = userId
        this.message = message
        this.createdOn = createdOn
        this.type = type
        this.deletedOn = deletedOn
        this.replyIds = replies
        this.repliedTo = repliedTo
        this.reactions = reactions ?? {
            count: {},
            data: {}
        }
    }
}

export const MessageConverter: FirestoreDataConverter<Message> = {
    toFirestore: (message: Message) => {
        return {
            userId: message.userId,
            message: message.message,
            createdOn: Timestamp.fromDate(new Date(message.createdOn)),
            type: message.type,
            deletedOn: message.deletedOn ? Timestamp.fromDate(new Date(message.deletedOn)) : null,
            replyIds: message.replyIds,
            repliedTo: message.repliedTo,
            reactions: message.reactions
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        // return new Message(id, data.userId, data.message, (data.createdOn as Timestamp).toDate().toString(), data.type)
        return {
            id,
            userId: data.userId,
            message: data.message,
            createdOn: (data.createdOn as Timestamp).toDate().toString(),
            type: data.type,
            deletedOn: data.deletedOn ? (data.deletedOn as Timestamp).toDate().toString() : null,
            replyIds: data.replyIds,
            repliedTo: data.repliedTo === null ? null : ({ ...data.repliedTo } as ReplyBasic),
            reactions: data.reactions
        } as Message
    }
}
