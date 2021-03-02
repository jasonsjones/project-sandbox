import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

function ProtectedRoute({ children, ...rest }: RouteProps): JSX.Element {
    const authCtx = useAuthContext();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                authCtx.token ? (
                    children
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: location } }} />
                )
            }
        />
    );
}

export default ProtectedRoute;
