import Link from 'next/link'
import Router from 'next/router'
import getConfig from 'next/config'
import { useEffect, useState } from 'react'
import cookie from 'cookie'

import { useAuthStore } from '../zustland/store'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const apiUrl = serverRuntimeConfig.apiUrl || publicRuntimeConfig.apiUrl
const Login = () => {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   const login = useAuthStore((state) => state.login)
   const login_success = useAuthStore((state) => state.login_success)
   const error = useAuthStore((state) => state.error)

   useEffect(() => {
      if (login_success) {
         Router.push('/')
      }
   }, [login_success])

   return (
      <div>
         <section className='bg-gray-50 dark:bg-gray-900'>
            <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
               <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
                  <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                     <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                        Sign in to your account
                     </h1>
                     {error && <h3 className=' text-red-600'>Email or password incorrect</h3>}
                     {error}
                     <form className='space-y-4 md:space-y-6'>
                        <div>
                           <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                              Your username
                           </label>
                           <input
                              type='text'
                              name='text'
                              id='text'
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                              placeholder='first.lastname'
                              required
                           />
                        </div>
                        <div>
                           <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                              Password
                           </label>
                           <input
                              type='password'
                              name='password'
                              id='password'
                              placeholder='••••••••'
                              onChange={(e) => setPassword(e.target.value)}
                              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                              required
                           />
                        </div>
                        <div className='flex items-center justify-between'>
                           <div className='flex items-start'>
                              <div className='flex items-center h-5'>
                                 <input
                                    id='remember'
                                    aria-describedby='remember'
                                    type='checkbox'
                                    className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                                    required=''
                                 />
                              </div>
                              <div className='ml-3 text-sm'>
                                 <label htmlFor='remember' className='text-gray-500 dark:text-gray-300'>
                                    Remember me
                                 </label>
                              </div>
                           </div>
                           <a href='#' className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'>
                              Forgot password?
                           </a>
                        </div>
                        <button
                           type='button'
                           className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                           onClick={() =>
                              login({
                                 username,
                                 password,
                              })
                           }
                        >
                           Sign in
                        </button>
                        <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                           Don’t have an account yet?{' '}
                           <Link href='/register'>
                              <span className='font-medium text-primary-600 hover:underline dark:text-primary-500'>Sign up</span>
                           </Link>
                        </p>
                     </form>
                  </div>
               </div>
            </div>
         </section>
      </div>
   )
}

export async function getServerSideProps({ req }) {
   const cookies = cookie.parse(req.headers.cookie ?? '')
   const access = cookies.access ?? false
   const resAPI = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/token/verify/`, {
      method: 'POST',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: access }),
   })
   if (resAPI.status == 200) {
      return {
         redirect: {
            destination: '/',
            permanent: false,
         },
      }
   }
   return { props: {} }
}

export default Login
