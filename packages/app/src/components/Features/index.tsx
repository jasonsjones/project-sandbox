import secureLogo from '../../assets/secure.svg';
import innovativeLogo from '../../assets/innovative.svg';

function Features(): JSX.Element {
    return (
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
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci illum
                            laborum libero maxime mollitia, amet consequuntur odit id? Neque quo
                            quaerat numquam minima blanditiis? Inventore, et quos? Optio, nesciunt
                            maiores.
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
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci illum
                            laborum libero maxime mollitia, amet consequuntur odit id? Neque quo
                            quaerat numquam minima blanditiis? Inventore, et quos? Optio, nesciunt
                            maiores.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;
