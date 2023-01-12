import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Dropdown, Modal } from 'flowbite-react'

import { useModal } from '../zustland/store'

const Story = ({ data, index }) => {
   const setModalState = useModal((state) => state.setModalState)
   const setModalData = useModal((state) => state.setModalData)

   // DroppableSnapshot = {
   // isDragging: true,
   // draggingOverWWith: storyid
   // }
   // console.log(data)
   return (
      <Draggable key={data?.id} draggableId={data?.id?.toString()} index={index}>
         {(providedDragable, snapshot) => (
            <div ref={providedDragable.innerRef} {...providedDragable.draggableProps} {...providedDragable.dragHandleProps}>
               <div
                  onClick={() => {
                     setModalState(true)
                     setModalData(data)
                  }}
                  style={{
                     transform: snapshot.isDragging ? 'rotate(4deg)' : 'rotate(0deg)',
                  }}
                  className='w-full mb-2 rounded-sm bg-white py-[6px] px-[8px] text-sm shadow-[0_1px_0_#091e4240]  hover:bg-[#f4f5f7]'
               >
                  <div className=' mb-1'>{data?.title}</div>
                  <div className=' mt-2 flex gap-2'>
                     <div>
                        {data?.description?.length > 0 && (
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='icon icon-tabler icon-tabler-message'
                              width='16'
                              height='16'
                              viewBox='0 0 24 24'
                              strokeWidth='1.5'
                              stroke='#7c7a7b'
                              fill='none'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                           >
                              <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                              <path d='M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4' />
                              <line x1='8' y1='9' x2='16' y2='9' />
                              <line x1='8' y1='13' x2='14' y2='13' />
                           </svg>
                        )}
                     </div>
                  </div>
                  <div className='  text-[13px]  text-gray-400'>Id : {data?.id}</div>
                  <div className='  text-[13px]  text-gray-400'>position : {data?.position}</div>
               </div>
            </div>
         )}
      </Draggable>
   )
}

export default Story
