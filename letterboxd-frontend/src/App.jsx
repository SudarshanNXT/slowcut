import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />}/>
      {/* <Route path='/login' element={<Login />}/> */}
    </Route>
  )
)

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
