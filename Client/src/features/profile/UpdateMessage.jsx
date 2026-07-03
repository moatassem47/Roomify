import { CircleAlert, CircleCheck } from "lucide-react";

const UpdateMessage = ({ message, status }) => {
  if(status==="good"){
    return (
        <div
      className="flex items-center gap-4 bg-secondary-container text-on-secondary-container p-4 rounded-xl custom-shadow border-l-4 border-secondary fade-in"
      id="success-toast"
    >
      <CircleCheck />
      <p className="font-label-md">{message}</p>
    </div>
    )
  }
   if(status==="bad"){
    return (
      <div className="flex items-center gap-4 bg-error-container text-on-error-container p-4 rounded-xl mb-6 border-l-4 border-error">
      <CircleAlert />
      <p className="font-label-md">{message}</p>
      </div>
    )
  }
}

export default UpdateMessage;
