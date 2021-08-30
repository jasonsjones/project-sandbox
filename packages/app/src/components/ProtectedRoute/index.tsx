import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Spinner from '../Spinner';

function ProtectedRoute({ children, ...rest }: RouteProps): JSX.Element {
    const authCtx = useAuthContext();
    const hasToken = localStorage.getItem('hasToken') === 'true';

    // If we know we have a token, let's show the spinner until we can
    // fetch a new access token
    if (hasToken && !authCtx.token) {
        return <Spinner />;
    }

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
