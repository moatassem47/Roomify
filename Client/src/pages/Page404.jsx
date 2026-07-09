import EmptyState from "../components/EmptyState"
import errorIMage from "../assets/images/error404.svg"

const Page404 = () => {
  return (
    <>
        <EmptyState image={errorIMage} alt="page not found image" title="Page Not Found" 
        text="The page you are looking for might have been removed had its name changed or is temporarily unavailable."
        button="Home Page"/>
    </>
  )
}

export default Page404