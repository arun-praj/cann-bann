import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const Story = ({ data, index }) => {
   return (
      <Draggable key={data.id} draggableId={data.id.toString()} index={index}>
         {(providedDragable) => (
            <div ref={providedDragable.innerRef} {...providedDragable.draggableProps} {...providedDragable.dragHandleProps}>
               <div className='w-full bg-green-400'>
                  {data.id}
                  {data.description}
               </div>
            </div>
         )}
      </Draggable>
   )
}

export default Story
