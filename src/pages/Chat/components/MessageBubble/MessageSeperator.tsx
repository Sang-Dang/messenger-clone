import { Separator } from '@/components/ui'
import format from 'date-fns/format'
import React from 'react'

type MessageSeperatorProps = {
    createdOn: string
}

export default function MessageSeperator({ createdOn }: MessageSeperatorProps) {
    return (
        <div className="relative mx-auto my-10">
            <Separator className="w-full bg-primary/20" />
            <p className="absolute left-1/2 w-max -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm font-light text-primary/70">
                {format(new Date(createdOn), 'dd/MM/yyyy - HH:mm')}
            </p>
        </div>
    )
}
