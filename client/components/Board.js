import React from 'react'
import { Dropdown, Label, TextInput } from 'flowbite-react'
const colors = [
   '#5F4B8BFF',
   '#E69A8DFF',
   '#00203FFF',
   '#2C5F2D',
   '#97BC62FF',
   '#00539CFF',
   '#EEA47FFF',
   '#101820FF',
   '#5CC8D7FF',
   '#89ABE3FF',
   '#F2AA4CFF',
]
//for more colors https://designwizard.com/blog/design-trends/colour-combination/
const Board = () => {
   return (
      <div className=' flex text-white flex-wrap justify-start '>
         <div className=' block mr-[2%] mb-[2%] rounded-[3px] min-w-[160px] hover:brightness-75 hover:border-[1px] transition-all cursor-pointer bg-[#5F4B8BFF] h-[96px] max-w-[23.5%] p-2'>
            <div className=' text-base font-semibold overflow-ellipsis'>Board Rudder</div>
         </div>
         <div className=' block mr-[2%] mb-[2%] rounded-[3px] min-w-[160px] bg-[#2C5F2D] h-[96px] max-w-[23.5%] p-2'>
            <div className=' text-base font-semibold overflow-ellipsis'>Board Rudder</div>
         </div>
         <div className=' block mr-[2%] mb-[2%] rounded-[3px] min-w-[160px] bg-[#5CC8D7FF] h-[96px] max-w-[23.5%] p-2'>
            <div className=' text-base font-semibold overflow-ellipsis'>Board Rudder</div>
         </div>
         <div className=' block mr-[2%] mb-[2%] rounded-[3px] min-w-[160px] bg-[#F2AA4CFF] h-[96px] max-w-[23.5%] p-2'>
            <div className=' text-base font-semibold overflow-ellipsis'>Board Rudder</div>
         </div>
         <div className=' block mr-[2%] mb-[2%] rounded-[3px] min-w-[160px] bg-[#EEA47FFF] h-[96px] max-w-[23.5%] p-2'>
            <div className=' text-base font-semibold overflow-ellipsis'>Board Rudder</div>
         </div>
         <Dropdown
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
            <Dropdown.Header className=' min-w-[301px]'>
               <span className='block text-sm min-w-[301px] text-center'>Create Board</span>
            </Dropdown.Header>

            <div className=' w-full p-4'>
               <div className='mb-2 block '>
                  <Label htmlFor='small' value='Board title*' sizing='xs' />
               </div>
               <TextInput id='small' type='text' sizing='sm' required />
            </div>

            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
         </Dropdown>
      </div>
   )
}

export default Board
