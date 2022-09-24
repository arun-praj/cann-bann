import { useRouter } from 'next/router'
import '../styles/globals.css'
import Nav from '../components/Nav'
function MyApp({ Component, pageProps }) {
   const router = useRouter()

   const hide_nav = ['/login', '/register']
   return (
      <>
         {!hide_nav.includes(router.pathname) && <Nav />}
         <Component {...pageProps} />
      </>
   )
}

export default MyApp
