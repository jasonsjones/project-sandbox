import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { useAuthContext } from '../../context/AuthContext';

function LoginPage(): JSX.Element {
    const { token } = useAuthContext();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mt-8 ">
            <div className="w-3/4 mx-auto md:w-1/3">
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;
