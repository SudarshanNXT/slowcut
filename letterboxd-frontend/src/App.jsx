import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage.jsx'
import FilmsPage from './pages/FilmsPage.jsx'
import FilmPage from './pages/FilmPage.jsx'
import PersonPage from './pages/PersonPage.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CreateListPage from './pages/CreateListPage.jsx'
import ListPage from './pages/ListPage.jsx'
import EditListPage from './pages/EditListPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import ProfileSubPage from './pages/ProfileSubPage.jsx'
import AboutPage from './pages/AboutPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />}/>
      <Route path='/about' element={<AboutPage />}/>
      <Route path='/search/films/:query/:page' element={<SearchPage />}/>
      <Route path='/search/person/:query/:page' element={<SearchPage />}/>
      <Route path='/search/films/:query' element={<SearchPage />}/>
      <Route path='/search/person/:query' element={<SearchPage />}/>
      <Route path='/search/:query/:page' element={<SearchPage />}/>
      <Route path='/search/:query' element={<SearchPage />}/>
      <Route path='/search' element={<SearchPage />}/>
      <Route path='/films' element={<FilmsPage />}/>
      <Route path='/film/:id' element={<FilmPage />}/>
      <Route path='/person/:id' element={<PersonPage />}/>
      <Route path='/review/:id' element={<ReviewPage />}/>
      <Route path='/error/not_found' element={<NotFoundPage />}/>
      <Route path="/:username" element={<ProfilePage />} />
      <Route path="/:username/:category" element={<ProfileSubPage />} />
      <Route path='/list/new' element={<RequireAuth> <CreateListPage /> </RequireAuth>}/>
      <Route path='/list/:id' element={<RequireAuth> <ListPage /> </RequireAuth>}/>
      <Route path='/list/:id/edit' element={<RequireAuth> <EditListPage /> </RequireAuth>}/>
      <Route path='*' element={<NotFoundPage />}/>
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
