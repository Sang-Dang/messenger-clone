/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Toaster, useToast } from '@/components/ui'
import { db } from '@/firebase'
import {
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp
} from 'firebase/firestore'

class User {
    id: string
    username: string
    password: string
    updatedOn: Timestamp

    constructor(username: string, password: string, id?: string, updatedOn?: Timestamp) {
        this.id = id ?? ''
        this.username = username
        this.password = password.startsWith('#') ? password.substring(1, password.length - 1) : password
        this.updatedOn = updatedOn ?? Timestamp.now()
    }

    toString() {
        return `User(id=${this.id}, username=${this.username}, password=${this.password})`
    }
}

const UserConverter = {
    toFirestore: (user: User) => {
        return {
            username: user.username,
            password: '#' + user.password + '#',
            updatedOn: user.updatedOn ?? serverTimestamp()
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options)
        return new User(data.username, data.password, data.id, data.updatedOn)
    }
}

export default function Test() {
    const { toast } = useToast()

    async function handlePost() {
        try {
            const user = new User('', 'admin', '123')
            const docRef = await addDoc(collection(db, 'users').withConverter(UserConverter), user)
            toast({
                title: 'Success',
                description: 'Document written with ID: ' + docRef.id
            })
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'Error',
                    description: error.message
                })
            }
        }
    }

    async function handleGet() {
        const docRef = doc(db, 'users', '9Ky4jqZVnlzAeA4juNWT').withConverter(UserConverter)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            toast({
                title: 'Success',
                description: 'Document data: ' + JSON.stringify(docSnap.data())
            })
        } else {
            toast({
                title: 'Error',
                description: 'No such document'
            })
        }
    }

    async function handleGetMany() {
        const q = query(collection(db, 'users')).withConverter(UserConverter)
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
        })
    }

    return (
        <>
            <div className="grid h-screen w-screen place-items-center">
                <div className="flex flex-col gap-5">
                    <div>
                        <Button onClick={handlePost}>POST DATA</Button>
                    </div>
                    <div>
                        <Button onClick={handleGetMany}>GET DATA</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
