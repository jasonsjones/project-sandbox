import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Spinner from '../Spinner';

interface Props {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: Props): JSX.Element {
    const authCtx = useAuthContext();
    const hasToken = localStorage.getItem('hasToken') === 'true';

    // If we know we have a token, let's show the spinner until we can
    // fetch a new access token
    if (hasToken && !authCtx.token) {
        return <Spinner />;
    }

    return authCtx.token ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
