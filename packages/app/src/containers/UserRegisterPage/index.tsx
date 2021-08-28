import { useHistory } from 'react-router-dom';
import UserRegisterForm from '../../components/UserRegisterForm';

function UserRegisterPage(): JSX.Element {
    const history = useHistory();

    const handleRegister = () => {
        history.push('/');
    };

    return (
        <div className="mt-8">
            <UserRegisterForm className="w-3/4 mx-auto md:w-1/3" onRegister={handleRegister} />
        </div>
    );
}

export default UserRegisterPage;
