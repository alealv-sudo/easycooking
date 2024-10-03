import React from 'react'
import logo from './logo.svg';
import './App.css';
import { CookiesProvider } from 'react-cookie'; 

///Router
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import {RECIPESELECTOR ,VIEWREVIEW ,VIEWGPOST ,VIEWRECIPE ,CALENDAR, EDITLIST, VIEWMARKETLIST , MARKETLIST,NEWLIST ,EDITREVIEWPOST,REVIEWPOST ,EDITGPOST ,GPOST, BLOG, HOME, LOGIN, LOGOUT, PRIVATE, PRUEBA , USER, REGISTER , POSTR, UPDATER ,PROFILE, RECIPESFILTERED, RECIPESADM, SRCHPOST, SRCHRECIPE, SRCHREVIEW, SRCHUSER} from './config/routes/paths';

import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import Register from './components/Login/Register';
import { AuthContextProvider } from './components/contexts/authContext';

import NotFound from './components/NotFound/NotFound';

///
import PublicRoute from './components/routes/publicRoute';
import PrivateRoute from './components/routes/PrivateRoute';

//componentes
import CompShowBlog from './components/blog/showBlog';
import Prueba from './components/Pruebas/prueba';
import Usuario from './components/profile/user';
import Publicar from './components/recipes/post';
import UpdateRecipes from './components/recipes/postUpdates';
import ViewRecipe from './components/recipes/viewRecipe'
import UserProfile from './components/profile/userProfile';
import GeneralPost from './components/postExtra/generalPost'
import EditGeneralPost from './components/postExtra/editGeneralPost'
import ViewGeneralPost from './components/postExtra/viewGeneralPostID';
import RecipeReviewPost from './components/postExtra/recipeReviewPost'
import EditRecipeReviewPost from './components/postExtra/editRecipeReviewPost'
import ViewReview from './components/postExtra/viewRecipeReviewID';
import MarketList from './components/marketList/marketList'
import NewMarketList from './components/marketList/newMarketList'
import ViewMarketList from './components/marketList/viewMarketList'
import EditListMarket from './components/marketList/editListMarket';
import RecipeCalendar from './components/recipeCalendar/recipeCalendar'
import RecipesFiltered from './components/blog/recipesFiltered';
import RecipesAdministrator from './components/recipes/recipesAdministrator'
import SearchByPostName from './components/searchBar/searchByPostName'
import SearchByRecipeName from './components/searchBar/serchByRecipesName'
import SearchByReviewName from './components/searchBar/searchByReviewName'
import SearchByUserName from './components/searchBar/searchByUserName'
import ShowRecipeSelector from "./components/blog/showRecipeSelector"

///Layout
import LayoutFront from './components/Layaout/Layout';

function App() {
  return (
    <AuthContextProvider>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <div className='App'>
          <Router>
            <Routes>

              <Route path='/' exact element={<PublicRoute />}>
                <Route index exact element={<Login />} />
                <Route path={LOGIN} exact element={<Login />} />
                <Route path={REGISTER} exact element={<Register />} />
              </Route>

              <Route path={PRIVATE} exact element={<PrivateRoute />}>
                <Route exact element={<LayoutFront />}>
                  <Route index exact element={<CompShowBlog />} />
                  <Route path={BLOG} exact element={<CompShowBlog />} />
                  <Route path={USER} exact element={<Usuario />} />
                  <Route path={POSTR} exact element={<Publicar />} />
                  <Route path={UPDATER} exact element={<UpdateRecipes />} />
                  <Route path={VIEWRECIPE} exact element={<ViewRecipe/>} />
                  <Route path={PRUEBA} exact element={<Prueba />} />
                  <Route path={LOGOUT} exact element={<Logout />} />
                  <Route path={PROFILE} exact element={<UserProfile />} />
                  <Route path={GPOST} exact element={<GeneralPost/>} />
                  <Route path={EDITGPOST} exact element={<EditGeneralPost/>} />
                  <Route path={VIEWGPOST} exact element={<ViewGeneralPost/>} />
                  <Route path={REVIEWPOST} exact element={<RecipeReviewPost/>} />
                  <Route path={EDITREVIEWPOST} exact element={<EditRecipeReviewPost/>} />
                  <Route path={VIEWREVIEW} exact element={<ViewReview/>} />
                  <Route path={NEWLIST} exact element={<NewMarketList/>} />
                  <Route path={MARKETLIST} exact element={<MarketList/>} />
                  <Route path={VIEWMARKETLIST} exact element={<ViewMarketList/>} />
                  <Route path={EDITLIST} exact element={<EditListMarket/>} />
                  <Route path={CALENDAR} exact element={<RecipeCalendar/>} />
                  <Route path={RECIPESFILTERED} exact element={<RecipesFiltered/>} />
                  <Route path={RECIPESADM}  exact element={<RecipesAdministrator/>} />

                  <Route path={SRCHPOST} exact element={<SearchByPostName/>} />
                  <Route path={SRCHRECIPE} exact element={<SearchByRecipeName/>} />
                  <Route path={SRCHREVIEW} exact element={<SearchByReviewName/>} />
                  <Route path={SRCHUSER} exact element={<SearchByUserName/>} />
                  <Route path={RECIPESELECTOR} exact element={<ShowRecipeSelector/>} />
                  
                  <Route path={'*'} element={<NotFound/>} />
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