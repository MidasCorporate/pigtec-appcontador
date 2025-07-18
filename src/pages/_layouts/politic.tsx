import { Outlet } from 'react-router-dom'


// import cap from '../../assets/cap.jpeg'

export function PoliticLayout() {
  return (
    // <div className="grid min-h-screen grid-cols-2 antialiased">

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    // </div>
  )
}
