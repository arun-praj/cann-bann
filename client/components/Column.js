import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { resetServerContext } from 'react-beautiful-dnd'
import Story from './Story'

resetServerContext()

const Column = ({ data, onAddStory, storyTitle, setStoryTitle }) => {
   const [isAddNewStory, setAddNewStory] = useState(false)

   return (
      <div key={data.id}>
         <div className=' w-[272px] bg-[#ebecf0] rounded-[3px]'>
            <div className=' min-h-[40px] py-[10px] px-4 overflow-hidden  break-words text-sm text=[#172b4d] font-medium '>
               {data.title}
               {data?.stories.length > 0 && <span className=' text-gray-400'> &nbsp;&nbsp;{data?.stories.length}</span>}
            </div>
            <div className=' mx-2 '>
               <Droppable droppableId={data.id.toString()}>
                  {(providedDropable) => (
                     <div className=' min-h-[5px]' ref={providedDropable.innerRef} {...providedDropable.droppableProps}>
                        {data.stories.map((d, index) => {
                           return <Story key={d?.id} data={d} index={index} />
                        })}
                        {providedDropable.placeholder}
                     </div>
                  )}
               </Droppable>

               {!isAddNewStory ? (
                  <div
                     onClick={() => setAddNewStory(true)}
                     className='w-full mb-2 rounded-sm text=[#5e6c84]   py-[6px] px-[8px]  text-sm hover:bg-[#f4f5f7] cursor-pointer hover:border-b-[#091e4240]'
                  >
                     <div className='opacity-60 flex items-center gap-1'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           fill='none'
                           viewBox='0 0 24 24'
                           strokeWidth={2}
                           stroke='currentColor'
                           className='w-4 h-4'
                        >
                           <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                        </svg>
                        <span>Add a story</span>
                     </div>
                  </div>
               ) : (
                  <div className='flex flex-col gap-1'>
                     <input
                        onChange={(e) => setStoryTitle(e.target.value)}
                        value={storyTitle}
                        className=' w-full rounded-sm text-sm'
                        type={'text'}
                        placeholder='Enter a title for a story'
                     />
                     <div className=' flex items-center gap-2'>
                        <button className=' text-sm text-white font-semibold rounded-sm  bg-[#0079bf] px-4 py-1' onClick={() => onAddStory(data?.id)}>
                           Add
                        </button>
                        <button className='hover:scale-105  z-50' onClick={() => setAddNewStory((prev) => !prev)}>
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
               )}
            </div>
            <div className='h-1'></div>
         </div>
      </div>
   )
}

export default Column
