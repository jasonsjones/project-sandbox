function CloseIcon(): JSX.Element {
    return (
        <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
            data-testid="close-icon"
        ></path>
    );
}

function MenuIcon(): JSX.Element {
    return (
        <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
            data-testid="menu-icon"
        ></path>
    );
}

interface Props {
    isOpen: boolean;
}

function MobileMenuIcon({ isOpen }: Props): JSX.Element {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 fill-current">
            <title>{`${isOpen ? 'Close' : 'Open Menu'}`}</title>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
        </svg>
    );
}

export default MobileMenuIcon;
