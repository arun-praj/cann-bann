import create from 'zustand'
import { setCookie } from 'cookies-next'
export const useAuthStore = create((set) => {
   return {
      login_success: false,
      error: false,

      setLoginSuccess: (payload) => {
         set({ login_success: payload ?? false })
      },
      login: async (payload) => {
         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/token/`, {
            method: 'POST',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
         })

         const data = await res.json()

         if (res.status == 200) {
            set({ error: false, login_success: true })
            setCookie('access', data?.access, { maxAge: 60 * 30 })
            setCookie('refresh', data?.refresh, { maxAge: 60 * 60 * 24 })
         } else {
            set({ error: true, login_success: false })
         }
      },
      logout: async () => {
         set({ error: false, login_success: true })
         setCookie('access', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict', path: '/api/' })
         setCookie('refresh', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict', path: '/api/' })
      },
   }
})
