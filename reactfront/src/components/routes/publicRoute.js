import React from 'react'
import { useAuthContext } from "../contexts/authContext";
import { PRIVATE } from "../../config/routes/paths";
import { Navigate, Outlet } from "react-router-dom";



export default function PublicRoute(){
    const {isAuthenticated} = useAuthContext();

    if (isAuthenticated) {
        return <Navigate to={PRIVATE}/>;
    }

    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
}