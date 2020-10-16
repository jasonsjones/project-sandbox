import React, { useEffect, useState } from 'react';
import secureLogo from './assets/secure.svg';
import innovativeLogo from './assets/innovative.svg';

function App(): JSX.Element {
    const [status, setStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `query { status }` })
        })
            .then((res) => res.json())
            .then(({ data }) => {
                setStatus(!!data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <p></p>;

    return (
        <>
            <div className="mt-8 mx-12 flex flex-col justify-center text-center border-2 rounded-lg shadow-md px-4 py-6">
                <h1 className="text-4xl text-purple-900">Hello React!</h1>
                <p className="text-lg text-gray-600">
                    A simple React app built with Typescript and Tailwind CSS
                </p>
                <a
                    className="mx-auto text-gray-900 border-2 border-purple-800 bg-purple-200 rounded-md py-2 px-4 my-4"
                    href="https://github.com/jasonsjones/side-project"
                >
                    View Source
                </a>
            </div>
            {!isLoading && (
                <div className="mt-12 max-w-md mx-auto text-lg text-gray-600 border-2 border-gray-600 rounded-md py-2 text-center">
                    GraphQL server status:
                    <svg
                        className={`w-6 h-6 ml-2 inline-block stroke-current ${
                            status ? 'text-green-500' : 'text-red-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {status ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        )}
                    </svg>
                    {status ? 'All Good!' : 'Ah snap... 😔 '}
                </div>
            )}

            <div className="w-full mx-auto mt-12 px-8 bg-gray-100">
                <h2 className="text-3xl text-purple-900 text-center py-6">Features</h2>
                <div className="flex flex-col justify-around pb-6 lg:flex-row">
                    <div className="flex flex-col justify-center lg:w-1/2">
                        <h3 className="text-2xl text-gray-800 text-center">Secure</h3>
                        <div className="flex flex-col p-4 lg:flex-row">
                            <img
                                src={secureLogo}
                                width="200"
                                alt="secure illustration"
                                className="self-center lg:self-start"
                            />
                            <p className="mt-6 text-gray-600 lg:ml-4 lg:mt-0">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci
                                illum laborum libero maxime mollitia, amet consequuntur odit id?
                                Neque quo quaerat numquam minima blanditiis? Inventore, et quos?
                                Optio, nesciunt maiores.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center mt-8 lg:mt-0 lg:w-1/2">
                        <h3 className="text-2xl text-gray-800 text-center">Innovative</h3>
                        <div className="flex flex-col p-4 lg:flex-row">
                            <img
                                src={innovativeLogo}
                                width="200"
                                alt="innovative illustration"
                                className="self-center lg:self-start"
                            />
                            <p className="mt-6 text-gray-600 lg:ml-4 lg:mt-0">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci
                                illum laborum libero maxime mollitia, amet consequuntur odit id?
                                Neque quo quaerat numquam minima blanditiis? Inventore, et quos?
                                Optio, nesciunt maiores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
