import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export class User {
    id: string
    name: string
    email: string
    avatar: string

    constructor(id: string, name: string, email: string, avatar: string) {
        this.id = id
        this.name = name
        this.email = email
        this.avatar = avatar
    }
}

export const UserConverter = {
    toFirestore: (user: User) => {
        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        return new User(id, data.name, data.email, data.avatar)
    }
}
