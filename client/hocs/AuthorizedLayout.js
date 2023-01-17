import React, { useState } from 'react'
import Router from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '../zustland/store'

const AuthorizedLayout = ({ children }) => {
   const setLoginSuccess = useAuthStore((state) => state.setLoginSuccess)
   const login_success = useAuthStore((state) => state.login_success)
   const setUser = useAuthStore((state) => state.setUser)

   useEffect(() => {
      async function verify() {
         const res = await fetch(`/api/verifyAccess`)
         const data = await res.json()
         if (data?.error == true) {
            setLoginSuccess(false)
            Router.push('/login')
         } else {
            setUser(data)
            setLoginSuccess(true)
         }
      }
      verify()
   }, [login_success])
   return <div>{children}</div>
}

// export async function getServerSideProps({ req }) {
//    const cookies = cookie.parse(req.headers.cookie ?? '')
//    const refresh = cookies.access ?? false
//    const resAPI = await fetch(`${process.env.NEXT_PUBLIC_HOST}/token/refresh/`, {
//       method: 'POST',
//       headers: {
//          Accept: 'application/json',
//          'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ refresh: refresh }),
//    })
//    // Pass data to the page via props
//    return { props: { data } }
// }

export default AuthorizedLayout
