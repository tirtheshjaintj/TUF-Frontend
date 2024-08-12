import Background from './components/Background'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
   <Background>
    <Outlet/>
    </Background>
   </>
  )
}

export default App
