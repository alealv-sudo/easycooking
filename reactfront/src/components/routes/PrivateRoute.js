import React from 'react'
import { useAuthContext } from "../contexts/authContext";
import { HOME, LOGIN } from "../../config/routes/paths";
import { Navigate, Outlet } from "react-router-dom";


export default function PublicRoute(){
    const {isAuthenticated} = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to={LOGIN}/>;
    }

    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
}