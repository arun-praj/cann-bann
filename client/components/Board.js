import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import { Dropdown, Label, TextInput } from 'flowbite-react'
import toast from 'react-hot-toast'
import { useBoardStore } from '../zustland/store'
const colors = [
   '#5F4B8BFF',
   '#E69A8DFF',
   '#00203FFF',
   '#2C5F2DFF',
   '#97BC62',
   '#00539C',
   '#EEA47FFF',
   '#101820FF',
   '#5CC8D7FF',
   '#89ABE3FF',
   '#F2AA4CFF',
]
//for more colors https://designwizard.com/blog/design-trends/colour-combination/
const Board = () => {
   const saveBoard = useBoardStore((store) => store.saveBoard)
   const board_error = useBoardStore((store) => store.board_error)
   const board_message = useBoardStore((store) => store.board_message)
   const fetchBoard = useBoardStore((store) => store.fetchBoard)
   const newBoard = useBoardStore((store) => store.newBoard)
   const save_success = useBoardStore((store) => store.save_success)
   const disable_save_success = useBoardStore((store) => store.disable_save_success)
   const boards = useBoardStore((store) => store.boards)

   const [closeModal, setCloseModal] = useState(true)

   const [selectedColor, setSelectedColor] = useState(() => {
      var item = colors[Math.floor(Math.random() * colors.length)]
      return item
   })
   const [board_title, setBoardTitle] = useState('')

   useEffect(() => {
      if (save_success) {
         disable_save_success()
         toast.success('New board created')
         Router.push(`/b/${newBoard?.id}`)
      }
   }, [save_success])

   useEffect(() => {
      fetchBoard()
   }, [newBoard])

   useEffect(() => {
      if (board_error == true) {
         toast.error(board_message)
      }
   }, [board_error])
   return (
      <div>
         <div className=' my-5 text-base font-bold text-[#5e6c84]'>YOUR WORKSPACE</div>

         <div className=' flex text-white flex-wrap justify-start '>
            {boards?.author_board?.map((board) => {
               return <_Boards board={board} />
            })}

            <Dropdown
               hidden={closeModal}
               label={
                  <div className='  mr-[2%]  rounded-[3px] min-w-[160px] bg-[#091e420a] hover:border-[3px] cursor-pointer transition-all h-[96px] max-w-[23.5%] p-2 text-[#172b4d] flex items-center justify-center'>
                     <div className='  overflow-ellipsis text-sm'>
                        <div className='flex justify-center  flex-col items-center'>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-6 h-6'
                           >
                              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                           </svg>
                           Create new board
                        </div>
                     </div>
                  </div>
               }
               placement='left-start'
               arrowIcon={false}
               inline={true}
            >
               <Dropdown.Header className=' w-[301px]'>
                  <span className='block text-sm min-w-[301px] text-center'>Create Board</span>
               </Dropdown.Header>

               <div className=' w-full p-4'>
                  <div className='mb-2 block '>
                     <Label htmlFor='small' value='Board title*' sizing='xs' />
                  </div>
                  <TextInput id='small' type='text' sizing='sm' onChange={(e) => setBoardTitle(e.target.value)} required />
               </div>
               <div className=' w-full p-4'>
                  <div className='mb-2 block '>
                     <Label htmlFor='small' value='Board color' sizing='xs' />
                  </div>
                  <div className='flex gap-2  max-w-[300px] flex-wrap '>
                     {colors.map((color) => {
                        return (
                           <div key={color}>
                              <input
                                 key={color}
                                 type={'radio'}
                                 name={color}
                                 id={color}
                                 checked={selectedColor == color}
                                 value={color}
                                 onChange={(e) => setSelectedColor(e.target.value)}
                                 className={'hidden'}
                              />
                              <label htmlFor={color}>
                                 <div
                                    style={{
                                       backgroundColor: `${color}`,
                                    }}
                                    className={
                                       (selectedColor == color ? ' border-[2px] border-[black] scale-110 ' : '') +
                                       'min-h-[32px] cursor-pointer w-[40px] hover:border-[3px] transition-all rounded-md'
                                    }
                                 ></div>
                              </label>
                           </div>
                        )
                     })}
                  </div>
               </div>

               {/* <Dropdown.Item>Settings</Dropdown.Item> */}
               <div className=' w-full p-4'>
                  <button
                     disabled={board_title.length > 0 ? false : true}
                     onClick={() => {
                        saveBoard({
                           board_name: board_title,
                           background_color: selectedColor,
                        })
                     }}
                     className={
                        (board_title.length > 0 ? '  opacity-100 ' : ' opacity-[0.5] ') +
                        ' bg-[#0079bf] w-full px-[6px] py-[8px] text-white rounded-md'
                     }
                  >
                     Create
                  </button>
               </div>
               <Dropdown.Divider />
            </Dropdown>
         </div>
         <div className='py-5'> </div>
         <div className=' my-5 text-base font-bold text-[#5e6c84]'>GUEST WORKSPACE</div>

         <div className=' flex text-white flex-wrap justify-start '>
            {boards?.member_board?.length > 0 ? (
               boards?.member_board?.map((board) => {
                  return <_Boards key={board?.id} board={board} />
               })
            ) : (
               <div className='text-black font-light  opacity-70'>Oops. Looks like you havent joined any other board.</div>
            )}
         </div>
      </div>
   )
}

const _Boards = ({ key, board }) => {
   return (
      <div
         key={key}
         style={{
            backgroundColor: board?.background_color,
            backgroundBlendMode: 'darken',
         }}
         onClick={() => {
            Router.push(`/b/${board.id}`)
         }}
         className=' block mr-[2%] mb-[2%] rounded-[3px] min-w-[160px] h-[96px] max-w-[23.5%] p-2 cursor-pointer hover:scale-105 transition-all'
      >
         <div className=' text-base font-semibold overflow-ellipsis'>{board.board_name}</div>
      </div>
   )
}

export default Board
