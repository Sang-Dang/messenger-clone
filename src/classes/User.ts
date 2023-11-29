import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export class User {
    id: string
    name: string
    email: string
    avatar: string
    lastLogin: string

    constructor(id: string, name: string, email: string, lastLogin: string, avatar?: string) {
        this.id = id
        this.name = name
        this.email = email
        this.avatar = avatar ?? '/img/user-default.jpg'
        this.lastLogin = lastLogin
    }
}

export const UserConverter = {
    toFirestore: (user: User) => {
        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            lastLogin: user.lastLogin
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        const id = snapshot.id
        return new User(id, data.name, data.email, data.lastLogin, data.avatar)
    }
}
