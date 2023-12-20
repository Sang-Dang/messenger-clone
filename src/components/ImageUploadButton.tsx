import { Button } from '@/components/ui'
import { Image } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'

type ImageUploadButtonProps = {
    onChange: (files: FileList | null) => void
}
export default function ImageUploadButton({ onChange }: ImageUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleClick() {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (files && files.length > 0) {
            onChange(files)
        }
    }

    return (
        <>
            <input className="hidden" ref={inputRef} onChange={handleFilesChange} type="file" multiple accept="" />
            <Button variant="ghost" onClick={handleClick} className="mr-1 aspect-square h-10 rounded-full p-1">
                <Image size={16} />
            </Button>
        </>
    )
}
