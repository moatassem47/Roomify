import Button from "../../../components/common/Button"
import Input from "../../../components/common/Input"


const RequestPasswordReset = () => {
  return (
    <form
      className="bg-white rounded-large shadow-ambient p-8 w-full max-w-fit flex flex-col gap-1 mt-15"
    >
          
      <div className="mb-5">
        <h1 className="text-3xl text-center">Forgot your password?</h1>
        <p className="font-sans text-brand-cedar text-center">
         Enter the email address associated with your account, and we'll send you a link to reset your password.
        </p>
      </div>
       
      <Input
        label="Email Address"
        name="email"
        placeHolder="Sam@example.com"

      />
         
        <Button
          type="submit"
          className="mt-6"
        >
          Reset Password
        </Button>     
    </form>
  )
}

export default RequestPasswordReset