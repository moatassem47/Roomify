
const Loading = ({text}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-surface-dim border-t-brand-cedar animate-spin" />
          <p className="text-sm font-sans text-brand-text">{text}</p>
        </div>
      </div>
  )
}

export default Loading