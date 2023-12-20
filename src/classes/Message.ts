import Reply from '@/classes/Reply'
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp
} from 'firebase/firestore'

export type Reactions = {
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
    createdOn: Timestamp
    deletedOn: Timestamp | null
    replyIds: string[]
    repliedTo: Reply | null
    type: ChatMessageTypes
    reactions: Reactions
    seenBy: string[]

    constructor(
        id: string,
        userId: string,
        message: string,
        createdOn: Timestamp,
        type: ChatMessageTypes,
        deletedOn: Timestamp | null,
        replies: string[] = [],
        repliedTo: Reply | null,
        reactions?: Reactions,
        seenBy?: string[]
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
        this.seenBy = seenBy ?? []
    }

    static serialize(message: Message): MessageSerializable {
        return {
            ...message,
            createdOn: message.createdOn.toMillis(),
            deletedOn: message.deletedOn?.toMillis() ?? null
        } satisfies MessageSerializable
    }

    static deserialize(data: MessageSerializable): Message | null {
        return data
            ? new Message(
                  data.id,
                  data.userId,
                  data.message,
                  Timestamp.fromMillis(data.createdOn),
                  data.type,
                  data.deletedOn ? Timestamp.fromMillis(data.deletedOn) : null,
                  data.replyIds,
                  data.repliedTo,
                  data.reactions,
                  data.seenBy
              )
            : null
    }
}

export type MessageSerializable = Omit<Message, 'createdOn' | 'deletedOn'> & {
    createdOn: number
    deletedOn: number | null
}

export const MessageConverter: FirestoreDataConverter<Message> = {
    toFirestore: (message: Message) => {
        return {
            userId: message.userId,
            message: message.message,
            createdOn: message.createdOn,
            type: message.type,
            deletedOn: message.deletedOn,
            replyIds: message.replyIds,
            repliedTo: message.repliedTo,
            reactions: message.reactions,
            seenBy: message.seenBy
        } satisfies Omit<Message, 'id'>
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)

        return new Message(
            snapshot.id,
            data.userId,
            data.message,
            data.createdOn,
            data.type,
            data.deletedOn,
            data.replyIds,
            data.repliedTo,
            data.reactions,
            data.seenBy ?? []
        )
    }
}
