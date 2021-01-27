import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import NavLogo from './NavLogo';

function Nav(): JSX.Element {
    const [isMobileLinksOpen, setIsMobileLinksOpen] = useState(false);

    const isFetching = false;
    const contextUser = false;

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
                    <button
                        className="focus:text-gray-100 focus:outline-none hover:text-gray-100 sm:hidden"
                        type="button"
                        onClick={() => setIsMobileLinksOpen(!isMobileLinksOpen)}
                    >
                        <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-8 h-8 fill-current"
                        >
                            {isMobileLinksOpen ? (
                                // The 'X' svg
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            ) : (
                                // The 'menu' svg
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            )}
                        </svg>
                    </button>
                    {/* The nav links that are displayed on larger screens */}
                    <div className="hidden sm:block flex items-center text-xl">
                        {!isFetching && !contextUser && (
                            <>
                                <NavLink
                                    to="/login"
                                    className="mr-6 p-2 hover:text-white"
                                    activeClassName="border-purple-400 border-b-2 text-white font-semibold"
                                    data-testid="desktop-login"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="p-2 hover:text-white"
                                    activeClassName="border-purple-400 border-b-2 text-white font-semibold"
                                    data-testid="desktop-register"
                                >
                                    Signup
                                </NavLink>
                            </>
                        )}

                        {!isFetching && contextUser && (
                            <button
                                type="button"
                                className="px-2 py-1 hover:text-white focus:text-white"
                                onClick={() => console.log('handle logout')}
                                data-testid="desktop-logout"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
                {/* The nav links on small screens that are displayed when the button is clicked */}
                <div className={`${isMobileLinksOpen ? 'block' : 'hidden'} mt-4 -ml-2 sm:hidden`}>
                    {!isFetching && !contextUser && (
                        <>
                            <NavLink
                                to="/login"
                                activeClassName="bg-purple-800 text-gray-100"
                                className="block px-2 py-1 font-semibold rounded hover:bg-purple-800 hover:text-gray-100"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                activeClassName="bg-purple-800 text-gray-100"
                                className="block px-2 py-1 mt-1 font-semibold rounded hover:bg-purple-800 hover:text-gray-100"
                            >
                                Signup
                            </NavLink>
                        </>
                    )}
                    {!isFetching && contextUser && (
                        <button
                            type="button"
                            className="w-full text-left px-2 py-1 mt-1 font-semibold rounded focus:bg-purple-800 hover:text-gray-100"
                            onClick={() => console.log('handle logout')}
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
