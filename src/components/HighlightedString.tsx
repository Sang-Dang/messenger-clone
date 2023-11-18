type HighlightedSubstringProps = {
    original: string
    substring: string
}
export default function HighlightedSubstring({ original, substring }: HighlightedSubstringProps) {
    function getSubstringFragments(originalString: string, substring: string) {
        const duplicateString = originalString.toLowerCase()
        const duplicateSubstring = substring.toLowerCase()

        const substringIndex = duplicateString.indexOf(duplicateSubstring)

        if (substringIndex === -1) {
            return [originalString]
        }

        const beforeSubstring = originalString.slice(0, substringIndex)
        const newSubstring = originalString.slice(substringIndex, substringIndex + substring.length)
        const afterSubstring = originalString.slice(substringIndex + substring.length)

        return [beforeSubstring, newSubstring, afterSubstring]
    }

    const fragments = getSubstringFragments(original, substring)

    return (
        <>
            {original.length === 0 ? (
                original
            ) : (
                <>
                    {fragments[0]}
                    <span className="bg-yellow-200">{fragments[1]}</span>
                    {fragments[2]}
                </>
            )}
        </>
    )
}
