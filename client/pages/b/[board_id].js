import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { DragDropContext } from 'react-beautiful-dnd'

import AuthorizedLayout from '../../hocs/AuthorizedLayout'
import Column from '../../components/Column'

import { useColumnStore } from '../../zustland/store'

const Board = () => {
   // const [columns, setColumns] = useState()
   const router = useRouter()
   const { board_id } = router.query
   const [windowLoaded, setWindowLoaded] = useState(false)

   const fetchBoardWithColumn = useColumnStore((state) => state.fetchBoardWithColumn)
   const column_board = useColumnStore((state) => state.column_board)
   // console.log(board_id)
   useEffect(() => {
      if (board_id) fetchBoardWithColumn(board_id)
   }, [board_id])
   useEffect(() => {
      if (typeof window != undefined) {
         setWindowLoaded(true)
      }
   }, [])

   const handleDragEnd = (result) => {
      console.log('drag end')
   }

   if (!column_board) {
      return <h1 className=' text-3xl text-black mt-20'>Loading...</h1>
   }
   return (
      <AuthorizedLayout>
         <div className=' text-black mt-20'>
            {windowLoaded && (
               <DragDropContext onDragEnd={handleDragEnd}>
                  <div className=' flex gap-3'>
                     {column_board?.column?.map((_column) => {
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
