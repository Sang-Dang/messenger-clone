export default function Test() {
    // useEffect(() => {
    //     async function run() {
    //         const collectionRef = collection(db, 'users').withConverter(UserConverter)
    //         const snapshot = await getDocs(collectionRef)

    //         snapshot.forEach(async (document) => {
    //             const avatar = document.data().avatar
    //             if (!avatar.startsWith('userAvatars')) {
    //                 const response = await fetch(avatar)
    //                 const blob = await response.blob()

    //                 const avatarUrl = `userAvatars/${document.id}`
    //                 const userDoc = doc(db, 'users', document.id).withConverter(UserConverter)
    //                 const storageRef = ref(storage, avatarUrl)
    //                 await uploadBytes(storageRef, blob)

    //                 await updateDoc(userDoc, {
    //                     avatar: avatarUrl
    //                 })
    //             }
    //         })
    //     }

    //     run()
    // }, [])

    // useEffect(() => {
    //     async function run() {
    //         const chatsRef = collection(db, 'chats').withConverter(ChatConverter)
    //         const chatsSnap = await getDocs(chatsRef)
    //         chatsSnap.forEach(async (chat) => {
    //             const messagesRef = collection(db, 'chats', chat.id, 'messages').withConverter(
    //                 MessageConverter
    //             )
    //             const messagesSnap = await getDocs(messagesRef)
    //             const chatMembers = chat.data().users

    //             messagesSnap.forEach(async (message) => {
    //                 updateDoc(message.ref, {
    //                     seenBy: chatMembers
    //                 })
    //             })
    //         })
    //     }

    //     run()
    // }, [])

    return <div>HELLOWORLD</div>
}
