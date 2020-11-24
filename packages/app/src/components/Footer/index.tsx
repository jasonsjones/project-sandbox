import React from 'react';
import About from './About';
import Connect from './Connect';

function Footer(): JSX.Element {
    return (
        <footer className="h-auto text-gray-300 bg-purple-900">
            <div className="flex justify-around p-8 flex-col sm:flex-row">
                <About />
                <Connect />
            </div>
            <div className="pb-4 text-center text-gray-400 text-xs">
                &copy; 2019-2020 Orion Labs
            </div>
        </footer>
    );
}

export default Footer;
