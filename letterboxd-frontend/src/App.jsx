import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SearchPage from './pages/SearchPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignupPage />}/>
      <Route path='/search/:query' element={<SearchPage />}/>
      <Route path='/search' element={<SearchPage />}/>
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
