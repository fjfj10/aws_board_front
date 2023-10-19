import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';

function AuthRoute(props) {
    
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal");

    if(!!principalState?.data?.data) {
        return <Navigate to={"/"} />
    }

    return (
        <Routes>
            <Route path="/signin" element={ <Signin /> } />
            <Route path="/signup" element={ <Signup /> } />
        </Routes>
    );
}

export default AuthRoute;