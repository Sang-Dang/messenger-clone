import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type ProfileCardProps = {
    children: ReactNode
    className?: string
}

export default function ProfileCard({ children, className }: ProfileCardProps) {
    return <div className={cn('rounded-lg bg-white p-3 shadow-md', className)}>{children}</div>
}

type TitleProps = {
    children: ReactNode
    className?: string
}
function Title({ children, className }: TitleProps) {
    return <h3 className={cn('text-xl font-bold', className)}>{children}</h3>
}
ProfileCard.Title = Title
