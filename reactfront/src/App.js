import React from 'react'
import logo from './logo.svg';
import './App.css';
import { CookiesProvider } from 'react-cookie';

///Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import {EDITREVIEWPOST,REVIEWPOST ,EDITGPOST ,GPOST, BLOG, HOME, LOGIN, LOGOUT, PRIVATE, PRUEBA, PRUEBA2, USER, REGISTER , POSTR, UPDATER, SHOWPOSTR, UPLOADTEST, PROFILE} from './config/routes/paths';

import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import Register from './components/Login/Register';
import { AuthContextProvider } from './components/contexts/authContext';

///
import PublicRoute from './components/routes/publicRoute';
import PrivateRoute from './components/routes/PrivateRoute';

//componentes
import CompShowBlog from './components/blog/showBlog';
import Prueba from './components/Pruebas/prueba';
import Prueba2 from './components/Pruebas/prueba2';
import Usuario from './components/Pruebas/user';
import Publicar from './components/recipes/post';
import UpdateRecipes from './components/recipes/postUpdates';
import ShowPostRecipes from './components/recipes/postShowRecipes';
import UploadTest from './components/Pruebas/UploadTest';
import UserProfile from './components/profile/userProfile';
import GeneralPost from './components/postExtra/generalPost'
import EditGeneralPost from './components/postExtra/editGeneralPost'
import RecipeReviewPost from './components/postExtra/recipeReviewPost'
import EditRecipeReviewPost from './components/postExtra/editRecipeReviewPost'

///Layout
import LayoutFront from './components/Layaout/Layout';

function App() {
  return (
    <AuthContextProvider>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <div className='App'>
          <Router>
            <Routes>

              <Route path='/' element={<PublicRoute />}>
                <Route index element={<Login />} />
                <Route path={LOGIN} exact element={<Login />} />
                <Route path={REGISTER} exact element={<Register />} />
              </Route>

              <Route path={PRIVATE} element={<PrivateRoute />}>
                <Route element={<LayoutFront />}>
                  <Route index exact element={<CompShowBlog />} />
                  <Route path={BLOG} element={<CompShowBlog />} />
                  <Route path={USER} element={<Usuario />} />
                  <Route path={POSTR} element={<Publicar />} />
                  <Route path={UPDATER} element={<UpdateRecipes />} />
                  <Route path={SHOWPOSTR} element={<ShowPostRecipes />} />
                  <Route path={PRUEBA} element={<Prueba />} />
                  <Route path={PRUEBA2} element={<Prueba2 />} />
                  <Route path={LOGOUT} element={<Logout />} />
                  <Route path={PROFILE} element={<UserProfile />} />
                  <Route path={UPLOADTEST} element={<UploadTest/>} />
                  <Route path={GPOST} element={<GeneralPost/>} />
                  <Route path={EDITGPOST} element={<EditGeneralPost/>} />
                  <Route path={REVIEWPOST} element={<RecipeReviewPost/>} />
                  <Route path={EDITREVIEWPOST} element={<EditRecipeReviewPost/>} />
                </Route>
              </Route>

            </Routes>
          </Router>
        </div>

      </CookiesProvider>
    </AuthContextProvider>
  );
}

export default App;