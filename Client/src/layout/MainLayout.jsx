
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import { Outlet, useLocation } from 'react-router-dom'
import useAuth from '../store/authStore'
import AuthPopUp from '../features/auth/components/AuthPopUp'
import { AnimatePresence } from 'framer-motion'
import ChatWidget from '../components/ChatWidget'


const MainLayout = () => {
  const isPopUp=useAuth((s)=>s.isPopUp)
  const location=useLocation()
  return (
    <div className='relative flex flex-col min-h-screen  '>
        <NavBar/>

        <main className="grow  min-h-150 mt-20">
            <Outlet/>
        </main>
        <Footer/>
        {location.pathname !== "/signup" && location.pathname !== "/login" && <ChatWidget />}
      <AnimatePresence>
        {isPopUp&& <AuthPopUp/>}
        
      </AnimatePresence>
    </div>
  )
}

export default MainLayout