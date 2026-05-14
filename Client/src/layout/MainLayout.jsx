
import Footer from '../components/common/Footer'
import NavBar from '../components/common/NavBar'
import { Outlet } from 'react-router-dom'
import useAuth from '../store/authStore'
import AuthPopUp from '../features/auth/components/AuthPopUp'
import { AnimatePresence } from 'framer-motion'


const MainLayout = () => {
  const {isPopUp}=useAuth()
  return (
    <div className='relative flex flex-col min-h-screen'>
        <NavBar/>

        <main className="grow">
            <Outlet/>
        </main>
        <Footer/>

      <AnimatePresence>
        {isPopUp&& <AuthPopUp/>}
      </AnimatePresence>
    </div>
  )
}

export default MainLayout