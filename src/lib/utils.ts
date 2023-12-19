import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function onlyEmojis(string: string) {
    return [...string].every((char) => /[\p{Emoji}]/u.test(char) && !/^\d$/.test(char))
}
