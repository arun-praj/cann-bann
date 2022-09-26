import create from 'zustand'
import { setCookie, getCookie } from 'cookies-next'
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

export const useBoardStore = create((set, get) => {
   return {
      boards: [],
      board_error: false,
      newBoard: {},
      board_message: '',
      save_success: false,
      disable_save_success: () => {
         set({ save_success: false })
      },
      fetchBoard: async () => {
         const res_boards = await fetch(`${process.env.NEXT_PUBLIC_HOST}/board/`, {
            method: 'GET',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               Authorization: `Bearer ${getCookie('access')}`,
            },
         })
         const boards_data = await res_boards.json()
         // console.log(boards_data)
         if (res_boards.status == 200) {
            set({ boards: boards_data, board_error: false, board_message: '' })
         }
      },
      saveBoard: async (payload) => {
         const res_board = await fetch(`${process.env.NEXT_PUBLIC_HOST}/board/`, {
            method: 'POST',
            headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               Authorization: `Bearer ${getCookie('access')}`,
            },
            body: JSON.stringify(payload),
         })

         const board_data = await res_board.json()
         if (res_board.status == 200) {
            set({ board_error: false, board_message: '', newBoard: board_data, save_success: true })
         } else {
            set({ board_error: true, board_message: board_data?.detail || board_data?.details, save_success: false })
         }
      },
   }
})

if (process.env.NODE_ENV === 'development') {
   mountStoreDevtool('Store', useAuthStore)
}
