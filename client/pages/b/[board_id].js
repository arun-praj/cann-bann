import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { DragDropContext } from 'react-beautiful-dnd'
import { getCookie } from 'cookies-next'
import cookie from 'cookie'

import AuthorizedLayout from '../../hocs/AuthorizedLayout'
import Column from '../../components/Column'

import { useModal } from '../../zustland/store'
import Backdrop from '../../hocs/Backdrop'
import toast from 'react-hot-toast'

const Board = (props) => {
   const router = useRouter()
   const { board_id } = router.query
   const { data } = props

   // const isOpen = useModal((state) => state.isOpen)
   // const setModalState = useModal((state) => state.setModalState)

   const [board, setBoard] = useState(data)
   const [columnTitle, setColumnTitle] = useState('')
   const [storyTitle, setStoryTitle] = useState('')
   const [isAddNewColumn, setAddNewColumn] = useState(false)
   const [isAddNewStory, setAddNewStory] = useState(false)

   const [windowLoaded, setWindowLoaded] = useState(false)

   useEffect(() => {
      if (typeof window != undefined) {
         setWindowLoaded(true)
      }
   }, [])

   const update_story_position = async (direction, drag_column, story_list, draggedStory, draggedDestination, draggedDestinationColumn) => {
      // console.log(direction, story_list, 'dragged ID: ', draggedStory, 'Dragged Destination:', draggedDestination)
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/story/bulk_update_position/`, {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('access')}`,
         },
         body: JSON.stringify({ direction, story_list, draggedStory, draggedDestination, drag_column, draggedDestinationColumn }),
      })
   }

   const addNewColumn = async () => {
      if (columnTitle.length < 1) {
         toast.error('Title cannot be empty')
         return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/column/`, {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('access')}`,
         },
         body: JSON.stringify({ board_id, title: columnTitle }),
      })
      const data = await res.json()

      if (res.status == 200) {
         setColumnTitle('')
         setAddNewColumn(false)

         setBoard((board) => ({ ...board, column: [...board.column, data] }))

         return
      } else {
         toast.error(res.error)
      }
   }

   const addNewStory = async (column_id) => {
      if (storyTitle.length < 1) {
         toast.error('Title cannot be empty')
         return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/story/`, {
         method: 'POST',
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('access')}`,
         },
         body: JSON.stringify({ column_id, title: storyTitle }),
      })
      const data = await res.json()
      if (res.status == 201) {
         setStoryTitle('')

         const board_copy = { ...board }

         const index_col = board_copy.column.findIndex((col) => col.id == data.column)
         board_copy.column[index_col].stories.push(data)
         console.log(board_copy)
         setBoard(board_copy)
      } else {
         toast.error('Something went wrong ' + res.error)
      }
   }

   const handleDragEnd = (result) => {
      // dropable = COLUMN, dragable = STORY
      const { destination, source, draggableId } = result

      // if destination null then do nothing
      if (!destination) {
         return
      }
      // if we put in same position
      if (destination.droppableId == source.droppableId && destination.index === source.index) {
         return
      }

      const range = (start = 0, end = 0) => {
         const inc = (end - start) / Math.abs(end - start)
         return Array.from(Array(Math.max(0, Math.abs(end - start) + 1)), (_, i) => Math.max(0, start + i * inc))
      }

      let directionOfDrag = destination.index > source.index ? 'DRAG_DOWN' : 'DRAG_UP'

      let affectedRange
      if (directionOfDrag === 'DRAG_DOWN') {
         affectedRange = range(source.index, destination.index)
      } else {
         affectedRange = range(destination.index, source.index)
      }
      console.log(directionOfDrag)
      console.log(affectedRange)
      const affectedStories = []
      // if in same column
      if (source.droppableId === destination.droppableId) {
         let ColumnIndex = board?.column.findIndex((col) => col?.id == destination.droppableId)
         let reorderStories = board?.column[ColumnIndex]?.stories?.map((story) => {
            if (story?.id == draggableId) {
               story.position = destination.index
               return story
            } else if (affectedRange?.includes(story?.position)) {
               if (directionOfDrag == 'DRAG_DOWN') {
                  story.position = story.position - 1
                  affectedStories.push(story?.id)
                  return story
               } else {
                  story.position = story.position + 1
                  affectedStories.push(story?.id)

                  return story
               }
            } else {
               return story
            }
         })
         //deep copy
         let board_cpy = { ...board }
         reorderStories = reorderStories.sort((a, b) => a.position - b.position)
         board_cpy.column[ColumnIndex].stories = reorderStories
         setBoard(board_cpy)
         update_story_position(directionOfDrag, 'SAME_COLUMN', affectedStories, parseInt(draggableId, 10), destination.index)
      }

      //if in different column
      if (source.droppableId != destination.droppableId) {
         const deep_data = { ...board }

         const indexOfSourceColumn = board?.column.findIndex((col) => col.id == source.droppableId)

         //remove story from sourcec
         const [removed_story] = deep_data?.column[indexOfSourceColumn]?.stories.splice(source.index, 1)

         const indexOfDestinationColumn = board?.column.findIndex((col) => col.id == destination.droppableId)

         //update position of story to destination index

         //add story to destination
         deep_data.column[indexOfDestinationColumn]?.stories.push(removed_story)

         //find the effected position of other stories in destination
         let affectedRange_stories_destination = range(destination.index, deep_data.column[indexOfDestinationColumn]?.stories.length - 1)
         let affectedRange_stories_source = range(source.index, deep_data.column[indexOfSourceColumn]?.stories.length)

         let idOfAffectedDestination = []
         let idOfAffectedSource = []

         let reorderDestinationStories = board?.column[indexOfDestinationColumn]?.stories?.map((story, index, allStories) => {
            if (story?.id == draggableId) {
               if (destination.index == 0) {
                  story.position = destination.index
               } else {
                  story.position = allStories[destination.index - 1].position + 1
               }
               return story
            } else if (affectedRange_stories_destination?.includes(story?.position)) {
               story.position = story.position + 1
               idOfAffectedDestination.push(story.id)
               return story
            } else {
               return story
            }
         })
         let reorderSourceStories = board?.column[indexOfSourceColumn]?.stories?.map((story) => {
            if (affectedRange_stories_source?.includes(story?.position)) {
               story.position = story.position - 1
               idOfAffectedSource.push(story.id)
               return story
            } else {
               return story
            }
         })
         reorderDestinationStories = reorderDestinationStories?.sort((a, b) => a.position - b.position)
         if (deep_data.column[indexOfDestinationColumn]?.stories) {
            deep_data.column[indexOfDestinationColumn].stories = reorderDestinationStories
            deep_data.column[indexOfSourceColumn].stories = reorderSourceStories
         }

         //get id and position of affected stories to update in db
         let idOfSource_w_position = deep_data.column[indexOfSourceColumn].stories
            .map((story) => {
               if (idOfAffectedSource.includes(story?.id)) {
                  return {
                     id: story.id,
                     position: story.position,
                  }
               }
               return null
            })
            .filter((n) => n)

         let idOfDestination_w_position = deep_data?.column[indexOfDestinationColumn]?.stories
            .map((story) => {
               if (idOfAffectedDestination.includes(story?.id)) {
                  return {
                     id: story.id,
                     position: story.position,
                     column: deep_data.column[indexOfDestinationColumn]?.id,
                  }
               }
               return null
            })
            .filter((n) => n)

         console.log(idOfDestination_w_position)
         const modifiedStories = [...idOfSource_w_position, ...idOfDestination_w_position]
         update_story_position(
            directionOfDrag,
            'DIFF_COLUMN',
            modifiedStories,
            parseInt(draggableId, 10),
            destination.index,
            deep_data.column[indexOfDestinationColumn].id
         )

         // console.log(modifiedStories)
         console.log(deep_data)
         setBoard(deep_data)
      }
   }

   if (!data) {
      return <h1 className=' text-3xl text-black mt-20'>Loading...</h1>
   }

   return (
      <AuthorizedLayout>
         <div
            style={{
               backgroundColor: board.background_color,
            }}
            className=' text-black h-screen  overflow-scroll '
         >
            <div className='pt-[59.9px] '>
               <nav className=' h-[52px]   w-full px-8  flex items-center'>
                  <div className='flex gap-2'>
                     <div
                        onClick={() => Router.push('/')}
                        className=' flex items-center gap-1 text-md px-3 py-1 cursor-pointer bg-[#ffffff49] text-white  transition-all font-semibold rounded-md'
                     >
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           fill='none'
                           viewBox='0 0 24 24'
                           strokeWidth={1.5}
                           stroke='currentColor'
                           className='w-6 h-6'
                        >
                           <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75' />
                        </svg>
                     </div>
                     <div className=' flex items-center gap-1 text-md px-3 py-1 cursor-pointer bg-[#ffffff49] text-white  transition-all font-semibold rounded-md'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           className='icon icon-tabler icon-tabler-layout-kanban'
                           width='16'
                           height='16'
                           viewBox='0 0 24 24'
                           strokeWidth='1.5'
                           stroke='#ffffff'
                           fill='none'
                           strokeLinecap='round'
                           strokeLinejoin='round'
                        >
                           <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                           <line x1='4' y1='4' x2='10' y2='4' />
                           <line x1='14' y1='4' x2='20' y2='4' />
                           <rect x='4' y='8' width='6' height='12' rx='2' />
                           <rect x='14' y='8' width='6' height='6' rx='2' />
                        </svg>

                        {board.board_name}
                     </div>
                  </div>
               </nav>
               <div className='flex flex-grow px-8 gap-2'>
                  {windowLoaded && (
                     <DragDropContext onDragEnd={handleDragEnd}>
                        <div className=' flex gap-3 '>
                           {board?.column?.map((_column) => {
                              return (
                                 <Column
                                    storyTitle={storyTitle}
                                    setStoryTitle={setStoryTitle}
                                    onAddStory={addNewStory}
                                    key={_column.id}
                                    data={_column}
                                 />
                              )
                           })}
                        </div>
                     </DragDropContext>
                  )}
                  {!isAddNewColumn && (
                     <div
                        onClick={() => setAddNewColumn(true)}
                        className=' min-w-[272px] h-10  rounded-[3px] bg-[#ffffff3d] flex items-center  px-3 gap-2 cursor-pointer hover:bg-[#ffffff5d]'
                     >
                        <>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='#ffffff'
                              className='w-4 h-4'
                           >
                              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                           </svg>
                           <span className='text-sm text-white'>Add new column</span>
                        </>
                     </div>
                  )}
                  {isAddNewColumn && (
                     <div className=' min-w-[272px]  h-24 rounded-[3px] bg-[#ffffff3d] flex items-center  px-3 gap-2 cursor-pointer hover:bg-[#ffffff5d]'>
                        <div className=' w-full flex gap-2 flex-col justify-between'>
                           <input
                              className='w-full py-1 px-2 text-sm rounded-md'
                              placeholder='Enter a title'
                              autoFocus
                              value={columnTitle}
                              onChange={(e) => setColumnTitle(e.target.value)}
                           />
                           <div className=' flex items-center gap-2'>
                              <button
                                 className=' text-sm text-white font-semibold rounded-sm  bg-[#0079bf] px-4 py-1'
                                 onClick={() => addNewColumn(columnTitle)}
                              >
                                 Add
                              </button>
                              <button className='hover:scale-105  z-50' onClick={() => setAddNewColumn((prev) => !prev)}>
                                 <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-6 h-6 z-50'
                                 >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                 </svg>
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <StoryModal></StoryModal>
         </div>
      </AuthorizedLayout>
   )
}

export async function getServerSideProps({ req, query }) {
   // Fetch data from external API
   const cookies = cookie.parse(req.headers.cookie ?? '')
   const access = cookies.access ?? false
   if (!access) {
      return {
         redirect: {
            destination: '/login',
            permanent: false,
         },
      }
   }
   const res = await fetch(`http://django:8000/api/board/${query?.board_id}/`, {
      method: 'GET',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         Authorization: `Bearer ${access}`,
      },
   })

   const data = await res.json()

   if (!data) {
      return {
         notFound: true,
      }
   }
   if (res.status == 200) {
      return { props: { data } }
   } else {
      // console.log(data)
      return { props: { error: true } }
   }
}

const StoryModal = () => {
   const isOpen = useModal((state) => state.isOpen)
   const setModalState = useModal((state) => state.setModalState)
   const modalData = useModal((state) => state.modalData)
   let created = new Date(modalData?.created_at).toDateString()
   let updated = new Date(modalData?.updated_at).toDateString()

   const priorityColor = {
      HIGHEST: '#BC5090',
      CRITICAL: '#FF6361',
      ALARMING: '#D2D462',
      LOW: '6F975C',
   }

   return (
      <>
         <div
            style={{
               display: isOpen ? 'block' : 'none',
            }}
            className=' fixed left-1/2 top-0 mt-[72px] z-40 translate-x-[-50%] bg-white shadow-md rounded-md w-[576px] p-3 pb-5'
         >
            <h2 className=' text-xl font-semibold flex items-center gap-3 '>
               <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='#7c7a7b' className='w-5 h-5'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'
                  />
               </svg>

               {modalData.title}
            </h2>
            <div className='mt-6 flex items-center gap-2 cursor-pointer'>
               <div className='flex items-center gap-1'>
                  <div>
                     <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='#7c7a7b' className='w-4 h-4'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           d='M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z'
                        />
                        <path strokeLinecap='round' strokeLinejoin='round' d='M6 6h.008v.008H6V6z' />
                     </svg>
                  </div>
                  <span className=' text-sm'>Labels:</span>
               </div>
               <div></div>
               <div className='bg-[#091e420E] flex items-center justify-center h-6 w-6  rounded-sm'>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                     <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                  </svg>
               </div>
            </div>
            <div className='mt-6 flex items-center gap-2 cursor-pointer'>
               <div className='flex items-center gap-1'>
                  <div>
                     <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='#7c7a7b' className='w-4 h-4'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
                        />
                     </svg>
                  </div>
                  <span className=' text-sm'>Assignees:</span>
               </div>
               <div></div>
               <div className='bg-[#091e420E] flex items-center justify-center h-6 w-6  rounded-sm'>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                     <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                  </svg>
               </div>
            </div>
            <div className='mt-6 flex items-center gap-2 cursor-pointer'>
               <div className='flex items-center gap-1'>
                  <div>
                     <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='#7c7a7b' className='w-4 h-4'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5' />
                     </svg>
                  </div>
                  <span className=' text-sm'>Priority:</span>
               </div>
               <div></div>
               <div
                  style={{
                     backgroundColor: priorityColor[modalData?.priority],
                  }}
                  className=' flex items-center justify-center text-xs p-1 px-2  rounded-sm'
               >
                  {modalData?.priority}
               </div>
            </div>
            <div className=' mt-6'>
               <div className='flex items-center gap-1'>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='#7c7a7b' className='w-4 h-4'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z'
                     />
                  </svg>

                  <h2 className=' text-sm'>Description</h2>
               </div>
               <input className=' rounded-md ml-5 mt-2 py-2 px-1 text-[12px] w-[96%]  ' value={modalData?.description} />
               {/* <h3 > {}</h3> */}
            </div>
            <div className=' mt-6'>
               <div className='flex items-center gap-1'>
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='#7c7a7b' className='w-4 h-4'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
                     />
                  </svg>

                  <h2 className=' text-sm'>Dates</h2>
               </div>

               <h3 className='ml-5 mt-2 text-[12px]'> created at : &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;{created}</h3>
               <h3 className='ml-5 text-[12px]'> updated at :&nbsp;&nbsp;&nbsp; &nbsp; {updated}</h3>
            </div>
            {/* {modalData?.id} */}
         </div>

         <Backdrop
            // style={{ position: 'absolute' }}

            className='fixed top-0 left-0 h-screen w-screen  bg-black  bg-opacity-60 z-30'
            style={{
               display: isOpen ? 'block' : 'none',
            }}
            onClick={() => setModalState(false)}
         ></Backdrop>
      </>
   )
}

export default Board
