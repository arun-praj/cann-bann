import React, { useState } from 'react'
import Router from 'next/router'
import { useEffect } from 'react'
import { useAuthStore } from '../zustland/store'

const AuthorizedLayout = () => {
   const [error, setError] = useState(false)
   const setLoginSuccess = useAuthStore((state) => state.setLoginSuccess)

   useEffect(() => {
      async function verify() {
         const res = await fetch(`/api/verifyAccess`)
         const data = await res.json()
         if (data?.error == true) {
            Router.push('/login')
            setLoginSuccess(false)
         } else {
            setLoginSuccess(true)
         }
      }
      verify()
   }, [])
   return <div>AuthorizedLayout</div>
}

export default AuthorizedLayout
