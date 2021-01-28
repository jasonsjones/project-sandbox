import React from 'react';
import Footer from '../../components/Footer';
import Nav from '../../components/Nav';

function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className="flex flex-col h-screen">
            <Nav />
            <div className="flex-grow flex-shrink-0 pb-6">{children}</div>
            <Footer />
        </div>
    );
}

export default Layout;
