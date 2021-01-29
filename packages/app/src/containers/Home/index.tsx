import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../../components/Features/indes';
import HeroBanner from '../../components/HeroBanner';
import ServerStatus from '../../components/ServerStatus';

function Home(): JSX.Element {
    return (
        <>
            <div className="mt-8 mx-12">
                <HeroBanner />
            </div>

            <div className="mt-12 max-w-md mx-auto">
                <ServerStatus />
            </div>

            <Features />

            <div className="mt-12 max-w-md mx-auto text-lg text-gray-600 border-2 border-gray-600 rounded-md py-2 text-center">
                <Link to="/users">Show Users</Link>
            </div>
        </>
    );
}

export default Home;
