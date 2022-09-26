import { useRouter } from 'next/router'
import '../styles/globals.css'
import Nav from '../components/Nav'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
   const router = useRouter()

   const hide_nav = ['/login', '/register']
   return (
      <div className=' font-mono'>
         {!hide_nav.includes(router.pathname) && <Nav />}
         <Component {...pageProps} />
         <Toaster />
      </div>
   )
}

export default MyApp
