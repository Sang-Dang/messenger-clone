import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export class User {
    id: string
    name: string
    avatar: string

    constructor(id: string, name: string, avatar: string) {
        this.id = id
        this.name = name
        this.avatar = avatar
    }
}

export const UserConverter = {
    toFirestore: (user: User) => {
        return {
            id: user.id,
            name: user.name,
            avatar: user.avatar
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        return new User(id, data.name, data.avatar)
    }
}
