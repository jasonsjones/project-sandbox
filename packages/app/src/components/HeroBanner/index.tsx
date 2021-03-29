import React from 'react';

function HeroBanner(): JSX.Element {
    return (
        <div
            className="w-full flex justify-center bg-gradient-to-b from-purple-800 to-white"
            style={{ minHeight: '500px' }}
        >
            <div className="flex flex-col justify-center items-center">
                <div className="bg-purple-100 bg-opacity-75 text-center rounded-md py-6 px-12 mx-4 md:mx-0">
                    <h1 className="text-4xl md:text-5xl text-purple-900">
                        ORION Labs Side Project
                    </h1>
                    <p className="mt-2 text-2xl text-gray-500">
                        A simple React app built with Typescript and Tailwind CSS
                    </p>
                    <a
                        className="block mt-8 text-gray-800 text-xl"
                        href="https://github.com/jasonsjones/side-project"
                    >
                        View Source &gt;
                    </a>
                </div>
            </div>
        </div>
    );
}

export default HeroBanner;
