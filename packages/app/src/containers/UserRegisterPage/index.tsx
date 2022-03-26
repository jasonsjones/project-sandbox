import { useNavigate } from 'react-router-dom';
import UserRegisterForm from '../../components/UserRegisterForm';

function UserRegisterPage(): JSX.Element {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/');
    };

    return (
        <div className="mt-8">
            <UserRegisterForm className="w-3/4 mx-auto md:w-1/3" onRegister={handleRegister} />
        </div>
    );
}

export default UserRegisterPage;
