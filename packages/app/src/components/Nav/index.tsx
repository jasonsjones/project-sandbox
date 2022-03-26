import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import MobileMenuButton from './MobileMenuButton';
import NavLogo from './NavLogo';

function Nav(): JSX.Element {
    const desktopNavLinkClasses = 'p-2 hover:text-white';
    const desktopActiveNavLinkClasses = 'border-purple-400 border-b-2 text-white font-semibold';

    const mobileNavLinkClasses =
        'block px-2 py-1 font-semibold rounded hover:bg-purple-800 hover:text-gray-100';
    const mobileActiveNavLinkClasses = 'bg-purple-800 text-gray-100';

    const [isMobileLinksOpen, setIsMobileLinksOpen] = useState(false);

    const { token, isFetchingToken, logout } = useAuthContext();

    return (
        <header className="px-8 py-4 bg-purple-900 text-gray-400">
            <nav data-testid="nav">
                <div className="flex items-center justify-between">
                    <div>
                        <Link to="/">
                            <NavLogo />
                        </Link>
                    </div>

                    {/* The button svg (menu or 'x') that is displayed on small screens */}
                    <MobileMenuButton
                        isTriggered={isMobileLinksOpen}
                        clickAction={() => setIsMobileLinksOpen(!isMobileLinksOpen)}
                    />

                    {/* The nav links that are displayed on larger screens */}
                    <div className="hidden sm:block items-center text-xl">
                        {!isFetchingToken && !token && (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `mr-6 ${desktopNavLinkClasses} ${
                                            isActive ? desktopActiveNavLinkClasses : ''
                                        }`
                                    }
                                    data-testid="desktop-login"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        `${desktopNavLinkClasses} ${
                                            isActive ? desktopActiveNavLinkClasses : ''
                                        }`
                                    }
                                    data-testid="desktop-register"
                                >
                                    Signup
                                </NavLink>
                            </>
                        )}

                        {!isFetchingToken && token && (
                            <button
                                type="button"
                                className="px-2 py-1 hover:text-white focus:text-white"
                                onClick={() => logout()}
                                data-testid="desktop-logout"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
                {/* The nav links on small screens that are displayed when the button is clicked */}
                <div className={`${isMobileLinksOpen ? 'block' : 'hidden'} mt-4 -ml-2 sm:hidden`}>
                    {!isFetchingToken && !token && (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `${mobileNavLinkClasses} ${
                                        isActive ? mobileActiveNavLinkClasses : ''
                                    }`
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `mt-1 ${mobileNavLinkClasses} ${
                                        isActive ? mobileActiveNavLinkClasses : ''
                                    }`
                                }
                            >
                                Signup
                            </NavLink>
                        </>
                    )}
                    {!isFetchingToken && token && (
                        <button
                            type="button"
                            className="w-full text-left px-2 py-1 mt-1 font-semibold rounded focus:bg-purple-800 hover:text-gray-100"
                            onClick={() => logout()}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Nav;
