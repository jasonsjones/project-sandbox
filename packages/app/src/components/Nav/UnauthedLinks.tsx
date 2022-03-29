import { NavLink } from 'react-router-dom';

interface Props {
    isMobile: boolean;
}

function UnauthedLinks({ isMobile }: Props): JSX.Element {
    const desktopNavLinkClasses = 'p-2 hover:text-white';
    const desktopActiveNavLinkClasses = 'border-purple-400 border-b-2 text-white font-semibold';

    const mobileNavLinkClasses =
        'block px-2 py-1 font-semibold rounded hover:bg-purple-800 hover:text-gray-100';
    const mobileActiveNavLinkClasses = 'bg-purple-800 text-gray-100';

    const navLinkClasses = isMobile ? mobileNavLinkClasses : desktopNavLinkClasses;
    const activeNavLinkClasses = isMobile
        ? mobileActiveNavLinkClasses
        : desktopActiveNavLinkClasses;

    return (
        <>
            {!isMobile ? (
                <div className="flex gap-x-6">
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                        }
                        data-testid="desktop-login"
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                        }
                        data-testid="desktop-register"
                    >
                        Signup
                    </NavLink>
                </div>
            ) : (
                <div className="flex flex-col gap-y-2">
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                        }
                        data-testid="mobile-login"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                        }
                        data-testid="mobile-register"
                    >
                        Signup
                    </NavLink>
                </div>
            )}
        </>
    );
}

export default UnauthedLinks;
