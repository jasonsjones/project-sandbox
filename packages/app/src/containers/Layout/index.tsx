import React from 'react';
import Footer from '../../components/Footer';
import Nav from '../../components/Nav';
import { AuthProvider } from '../../context/AuthContext';

function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <AuthProvider>
            <div className="flex flex-col h-screen">
                <Nav />
                <div className="flex-grow flex-shrink-0 pb-6">{children}</div>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default Layout;
