import React from 'react'
import logo from './logo.svg';
import './App.css';
import { CookiesProvider } from 'react-cookie';

///Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { BLOG, HOME, LOGIN, LOGOUT, PRIVATE, PRUEBA, PRUEBA2, USER, REGISTER , POSTP} from './config/routes/paths';
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
import Publicar from './components/Pruebas/post';

///Layout
import LayoutFront from './components/Layaout/Layout';

function App() {
  return (
    <AuthContextProvider>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Router>
          <Routes>
            
            <Route path='/' element={<PublicRoute/>}>
              <Route index element={<Login/>}/>
              <Route path={LOGIN} exact  element={<Login/>}/>
              <Route path={REGISTER} exact  element={<Register/>}/>
            </Route>

            <Route path={PRIVATE} element={<PrivateRoute/>}>
              <Route element={<LayoutFront/>}>
                <Route index exact  element={<CompShowBlog/>}/>
                <Route path={BLOG}   element={<CompShowBlog/>}/>
                <Route path={USER}   element={<Usuario/>}/>
                <Route path={POSTP}   element={<Publicar/>}/>
                <Route path={PRUEBA}   element={<Prueba/>}/>
                <Route path={PRUEBA2}   element={<Prueba2/>}/>
                <Route path={LOGOUT}   element={<Logout/>}/>
              </Route>
            </Route>
            
          </Routes>
      </Router>
      </CookiesProvider>
    </AuthContextProvider>
  );
}

export default App;
