import programming from '../../assets/programming.svg';

function HeroBanner(): JSX.Element {
    return (
        <div
            className="w-full pb-12 px-12 flex flex-col justify-center items-center gap-12 bg-gradient-to-b from-purple-900 to-white lg:flex-row lg:pb-0"
            style={{ minHeight: '500px' }}
        >
            <img
                src={programming}
                width="500"
                alt="programming illustration"
                className="mt-12 lg:mt-0"
            />
            <div className="flex flex-col justify-center items-center">
                <div className="bg-purple-100 bg-opacity-75 text-center rounded-md py-6 px-12 mx-4 md:mx-0">
                    <h1 className="text-4xl md:text-5xl text-purple-900">
                        ORION labs Side Project
                    </h1>
                    <p className="mt-10 text-2xl text-gray-500">
                        A React app built with Typescript and Tailwind CSS
                    </p>
                    <p className="text-2xl text-gray-500">
                        Supported with Graphql API powered by NestJS
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
