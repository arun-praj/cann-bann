import create from 'zustand'
import { setCookie } from 'cookies-next'
import { mountStoreDevtool } from 'simple-zustand-devtools'
export const useAuthStore = create((set) => {
   return {
      login_success: false,
      error: false,
      user: null,
      setLoginSuccess: ({ payload }) => {
         set({ login_success: payload ?? false })
      },
      setUser: ({ user }) => {
         console.log(user)
         set({
            user: {
               email: user?.email,
               username: user?.username,
            },
         })
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
         set({ error: false, login_success: false, user: null })
         setCookie('access', '', { expires: new Date(0) })
         setCookie('refresh', '', { expires: new Date(0) })
      },
   }
})
if (process.env.NODE_ENV === 'development') {
   mountStoreDevtool('Store', useAuthStore)
}
