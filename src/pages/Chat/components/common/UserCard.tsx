import { User } from '@/classes/User'
import HighlightedSubstring from '@/components/HighlightedString'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import useRefresh from '@/lib/hooks/useRefresh'
import { cn } from '@/lib/utils'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { Check } from 'lucide-react'

type UserCardProps = {
    doc: QueryDocumentSnapshot<User, DocumentData>
    isUserSelected: boolean
    handleSelect: (id: string) => void
    searchTerm: string
}
export default function UserCard({ doc, isUserSelected, handleSelect, searchTerm }: UserCardProps) {
    const refresh = useRefresh()

    function handleSelectWrapper(id: string) {
        handleSelect(id)
        refresh()
    }

    return (
        <>
            <button
                key={doc.id}
                className={cn(
                    'mb-2 flex w-full cursor-pointer gap-3 rounded-lg border-2 border-neutral-200/30 bg-neutral-50/30 p-3 text-left transition-all hover:border-neutral-50/30 hover:shadow-md focus:border-neutral-50/30 focus:shadow-md focus:outline-none',
                    isUserSelected && 'border-blue-500/50 bg-blue-500/50 shadow-md'
                )}
                onClick={() => handleSelectWrapper(doc.id)}
            >
                <Avatar className="rounded-lg">
                    <AvatarImage src={doc.data().avatar} alt={doc.data().name} />
                    <AvatarFallback>{doc.data().name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-grow flex-col justify-center gap-1">
                    <h6 className="text-lg font-bold leading-none">
                        <HighlightedSubstring original={doc.data().name} substring={searchTerm} />
                    </h6>
                    <p className="text-xs">
                        <HighlightedSubstring original={doc.data().email} substring={searchTerm} />
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className="grid h-5 w-5 place-items-center rounded-lg bg-neutral-100">{isUserSelected && <Check className="w-4" />}</div>
                </div>
            </button>
        </>
    )
}
