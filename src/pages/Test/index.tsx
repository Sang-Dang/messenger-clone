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

    return <div>HELLOWORLD</div>
}
