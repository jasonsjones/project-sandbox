import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../../components/Features/indes';
import HeroBanner from '../../components/HeroBanner';
import ServerStatus from '../../components/ServerStatus';
import { useAuthContext } from '../../context/AuthContext';

function Home(): JSX.Element {
    const { token } = useAuthContext();

    return (
        <>
            <HeroBanner />

            <div className="mt-12 mx-auto flex flex-col items-center">
                <ServerStatus />
                {token ? (
                    <div className="mt-10 text-lg text-gray-600 border-2 border-gray-600 rounded-md py-2 px-4 text-center">
                        <Link to="/users">List Users</Link>
                    </div>
                ) : (
                    ''
                )}
            </div>

            <Features />
        </>
    );
}

export default Home;
