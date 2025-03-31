import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export const ProtectedRoute = ({ children }) => { 
    const token = Cookies.get("refresh_token");
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children; 
};

export const AuthRoute = ({children}) =>{
     const token = Cookies.get("refresh_token");
     
    if(token){
        return <Navigate to="/home" replace/>
    }
    return children
}

