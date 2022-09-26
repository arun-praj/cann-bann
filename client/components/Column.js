import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { resetServerContext } from 'react-beautiful-dnd'
import Story from './Story'

resetServerContext()

const Column = ({ data }) => {
   return (
      <div key={data.id}>
         <div className=' w-40 bg-red-500'>
            <div className=' min-h-[40px]'>{data.title}</div>
            <Droppable droppableId={data.id.toString()}>
               {(providedDropable) => (
                  <div ref={providedDropable.innerRef} {...providedDropable.droppableProps}>
                     {data.stories.map((d, index) => {
                        return <Story key={d.id} data={d} index={index} />
                     })}
                     {providedDropable.placeholder}
                  </div>
               )}
            </Droppable>
         </div>
      </div>
   )
}

export default Column
