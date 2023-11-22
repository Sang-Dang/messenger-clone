import '@/styles/LoadingSpinner.css'

export default function LoadingSplash() {
    return (
        <div className="fixed z-50 flex h-fullNoHeader w-screen flex-col items-center justify-center gap-5 bg-neutral-800/70">
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
            <h1 className="select-none text-2xl font-bold text-white">Loading...</h1>
        </div>
    )
}
