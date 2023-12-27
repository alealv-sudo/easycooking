import React, { useEffect } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PropTypes } from "prop-types";
import { Cookies, useCookies } from 'react-cookie';

const MY_AUTH_APP = 'MY_AUTH_APP';

export const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export function AuthContextProvider({children}){

    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const [User, setUser] = useState({})
    const [isAuthenticated, setIsAuthenticated] = useState(window.localStorage.getItem(MY_AUTH_APP) ?? false);

    const loginUser = (userlog) => {
        const userAuth = userlog
        setUser(userAuth);
        console.log("Usuario auth",userlog);
        console.log("Usuario",User);
    
        setCookie('user', userlog.name, {path:'/'})
        setCookie('id', userlog.id, {path:'/'})
        setCookie('email', userlog.email, {path:'/'})
        login();
    } 

    const login = useCallback(function(){
        localStorage.setItem(MY_AUTH_APP, true);
        setIsAuthenticated(true);
    },[]);

    const logout = useCallback(function(){
        handleRemoveCookie()
        localStorage.removeItem(MY_AUTH_APP);
        setIsAuthenticated(false);
    },[]);

    const value = useMemo( () => ({
        loginUser,
        login,
        logout,
        isAuthenticated,
        User,
        cookies
    }), [loginUser,login,logout,isAuthenticated,User,cookies]);

    function handleRemoveCookie() {
        removeCookie('user', {path:'/'});
        removeCookie("id",{path:'/'});
        removeCookie("email",{path:'/'});
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
    children: PropTypes.object
}

export function useAuthContext() {
    return useContext(AuthContext);
}