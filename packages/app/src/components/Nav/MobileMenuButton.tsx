import MobileMenuIcon from './MobileMenuIcon';

interface Props {
    isTriggered: boolean;
    clickAction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function MobileMenuButton({ isTriggered, clickAction }: Props): JSX.Element {
    return (
        <button
            className="focus:text-gray-100 focus:outline-none hover:text-gray-100 sm:hidden"
            type="button"
            onClick={clickAction}
        >
            <MobileMenuIcon isOpen={isTriggered} />
        </button>
    );
}

export default MobileMenuButton;
