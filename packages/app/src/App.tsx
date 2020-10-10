import React, { useEffect, useState } from 'react';

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
        </>
    );
}

export default App;
