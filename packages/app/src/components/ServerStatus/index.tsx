import useServerStatus from '../../hooks/useServerStatus';
import Spinner from '../Spinner';

function ServerStatus(): JSX.Element {
    const { data: status, isLoading } = useServerStatus();

    if (isLoading) return <Spinner />;

    return (
        <>
            {!isLoading && (
                <div className="text-lg text-gray-600 border-2 border-gray-600 rounded-md py-2 px-4 text-center">
                    GraphQL server status:
                    <svg
                        className={`w-6 h-6 ml-2 inline-block stroke-current ${
                            status?.data ? 'text-green-500' : 'text-red-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {status?.data ? (
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
                    {status?.data ? 'All Good!' : 'Ah snap... 😔 '}
                </div>
            )}
        </>
    );
}

export default ServerStatus;
