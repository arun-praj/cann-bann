import React, { useEffect } from 'react'
import { Dropdown } from 'flowbite-react'
import { useAuthStore } from '../zustland/store'
import Avatar from 'react-avatar'
import Router from 'next/router'

const Nav = () => {
   const logout = useAuthStore((state) => state.logout)
   const login_success = useAuthStore((state) => state.login_success)
   const user = useAuthStore((state) => state.user)

   useEffect(() => {}, [login_success, user, logout])

   return (
      <div>
         <nav className='bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600'>
            <div className='container flex flex-wrap justify-between items-center mx-auto'>
               <a href='#' className='flex items-center' onClick={() => Router.push('/')}>
                  <img src='/favicon.ico' className='mr-3 h-6 sm:h-9' alt='Flowbite Logo' />
                  <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>CannBann</span>
               </a>
               <div className='flex md:order-2'>
                  <Dropdown
                     label={
                        <div className=' mt-1'>
                           <Avatar name={user?.username.replace('.', ' ')} size='35' round={true} />
                        </div>
                     }
                     arrowIcon={false}
                     inline={true}
                  >
                     <Dropdown.Header>
                        <span className='block text-sm'>{user?.username}</span>
                        <span className='block truncate text-sm font-medium'>{user?.email}</span>
                     </Dropdown.Header>

                     <Dropdown.Item>Settings</Dropdown.Item>

                     <Dropdown.Divider />
                     <Dropdown.Item
                        onClick={() => {
                           logout()
                           Router.push('/login')
                        }}
                     >
                        Sign out
                     </Dropdown.Item>
                  </Dropdown>
                  <button
                     data-collapse-toggle='navbar-sticky'
                     type='button'
                     className='inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
                     aria-controls='navbar-sticky'
                     aria-expanded='false'
                  >
                     <span className='sr-only'>Open main menu</span>
                     <svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
                        <path
                           fillRule='evenodd'
                           d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                           clipRule='evenodd'
                        ></path>
                     </svg>
                  </button>
               </div>
               {/* <div className='hidden justify-between items-center w-full md:flex md:w-auto md:order-1' id='navbar-sticky'>
                  <ul className='flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700'>
                     <li>
                        <a
                           href='#'
                           className='block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white'
                           aria-current='page'
                        >
                           Home
                        </a>
                     </li>
                     <li>
                        <a
                           href='#'
                           className='block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                        >
                           About
                        </a>
                     </li>
                     <li>
                        <a
                           href='#'
                           className='block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                        >
                           Services
                        </a>
                     </li>
                     <li>
                        <a
                           href='#'
                           className='block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                        >
                           Contact
                        </a>
                     </li>
                  </ul>
               </div> */}
            </div>
         </nav>
      </div>
   )
}

export default Nav
