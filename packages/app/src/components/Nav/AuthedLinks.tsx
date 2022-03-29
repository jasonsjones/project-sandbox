import { useAuthContext } from '../../context/AuthContext';

interface Props {
    isMobile: boolean;
}

function AuthedLinks({ isMobile }: Props): JSX.Element {
    const { logout } = useAuthContext();
    return (
        <>
            {!isMobile ? (
                <button
                    type="button"
                    className="px-2 py-1 hover:text-white focus:text-white"
                    onClick={() => logout()}
                    data-testid="desktop-logout"
                >
                    Logout
                </button>
            ) : (
                <button
                    type="button"
                    className="w-full text-left px-2 py-1 mt-1 font-semibold rounded focus:bg-purple-800 hover:text-gray-100"
                    onClick={() => logout()}
                    data-testid="mobile-logout"
                >
                    Logout
                </button>
            )}
        </>
    );
}

export default AuthedLinks;
