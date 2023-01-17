import AuthorizedLayout from '../hocs/AuthorizedLayout'
import Board from '../components/Board'

export default function Home() {
   return (
      <div>
         <AuthorizedLayout>
            <main className=' mt-20'>
               <div className='  max-w-[1250px] m-auto px-14 '>
                  <Board />
               </div>
            </main>
         </AuthorizedLayout>
      </div>
   )
}
