import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import UnauthedLinks from './UnauthedLinks';
import AuthedLinks from './AuthedLinks';
import MobileMenuButton from './MobileMenuButton';
import NavLogo from './NavLogo';

function Nav(): JSX.Element {
    const [isMobileLinksOpen, setIsMobileLinksOpen] = useState(false);
    const { token, isFetchingToken } = useAuthContext();

    if (isFetchingToken) {
        return <></>;
    }

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
                        {!token && <UnauthedLinks isMobile={false} />}

                        {token && <AuthedLinks isMobile={false} />}
                    </div>
                </div>
                {/* The nav links on small screens that are displayed when the button is clicked */}
                <div className={`${isMobileLinksOpen ? 'block' : 'hidden'} mt-4 -ml-2 sm:hidden`}>
                    {!token && <UnauthedLinks isMobile={true} />}
                    {token && <AuthedLinks isMobile={true} />}
                </div>
            </nav>
        </header>
    );
}

export default Nav;
