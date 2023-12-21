import React, { useEffect } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PropTypes } from "prop-types";

const MY_AUTH_APP = 'MY_AUTH_APP';

export const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export function AuthContextProvider({children}){

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loginAppUser');
        //const UserJSON = JSON.parse(loggedUserJSON);
        setUser(loggedUserJSON);
    },[]);

    const [User, setUser] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(window.localStorage.getItem(MY_AUTH_APP) ?? false);

    const loginUser = (name, password) => {

        setUser(name);
        if (password === "password"){
            localStorage.setItem('loginAppUser', User);
            console.log(User, name)
            login();
        }
        
    } 

    const login = useCallback(function(){
        localStorage.setItem(MY_AUTH_APP, true);
        setIsAuthenticated(true);
        console.log()
    },[]);

    const logout = useCallback(function(){
        localStorage.removeItem(MY_AUTH_APP);
        setIsAuthenticated(false);
    },[]);

    const value = useMemo( () => ({
        loginUser,
        login,
        logout,
        isAuthenticated,
        User
    }), [loginUser,login,logout,isAuthenticated,User]);


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
    children: PropTypes.object
}

export function useAuthContext() {
    return useContext(AuthContext);
}