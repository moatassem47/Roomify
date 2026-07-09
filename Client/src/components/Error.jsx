

const Error = ({error}) => {
  return (
     <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-brand-error font-sans">{error.message}</p>
      </div>
  )
}

export default Error