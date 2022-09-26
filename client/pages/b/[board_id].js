import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { DragDropContext } from 'react-beautiful-dnd'

import AuthorizedLayout from '../../hocs/AuthorizedLayout'
import Column from '../../components/Column'

//fetch your column from here
const coldata = [
   {
      id: 1,
      title: 'TODO',
      position: 0,
      board: 12,
      created_at: '',
      stories: [
         {
            id: 100,
            description: 'ar',
            position: 0,
            priority: 'Low',
         },
         {
            id: 200,
            description: 'br',
            position: 1,
            priority: 'Low',
         },
         {
            id: 300,
            description: 'cr',
            position: 2,
            priority: 'Low',
         },
      ],
   },
   {
      id: 2,
      title: 'ONGOING',
      position: 1,
      board: 12,
      created_at: '',
      stories: [
         {
            id: 10,
            description: 'ar',
            position: 0,
            priority: 'Low',
         },
         {
            id: 11,
            description: 'br',
            position: 1,
            priority: 'Low',
         },
         {
            id: 12,
            description: 'cr',
            position: 2,
            priority: 'Low',
         },
      ],
   },
]

const Board = () => {
   // const [columns, setColumns] = useState()
   const router = useRouter()
   const { board_id } = router.query
   const [windowLoaded, setWindowLoaded] = useState(false)
   useEffect(() => {
      if (typeof window != undefined) {
         setWindowLoaded(true)
      }
   }, [])
   const handleDragEnd = (result) => {
      console.log('drag end')
   }
   return (
      <AuthorizedLayout>
         <div className=' text-black mt-20'>
            {windowLoaded && (
               <DragDropContext onDragEnd={handleDragEnd}>
                  <div className=' flex gap-3'>
                     {coldata.map((_column) => {
                        return <Column key={_column.id} data={_column} />
                     })}
                  </div>
               </DragDropContext>
            )}
         </div>
      </AuthorizedLayout>
   )
}

//getServerSide
//fetch columns/ boards

export default Board
