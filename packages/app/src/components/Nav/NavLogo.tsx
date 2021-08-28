function NavLogo(): JSX.Element {
    return (
        <div className="flex flex-col items-end">
            <h3 className="text-3xl font-bold uppercase hover:text-white">Orion</h3>
            <div className="-mr-2 px-2 text-lg text-white font-semibold bg-purple-400 rounded-full">
                labs
            </div>
        </div>
    );
}

export default NavLogo;
