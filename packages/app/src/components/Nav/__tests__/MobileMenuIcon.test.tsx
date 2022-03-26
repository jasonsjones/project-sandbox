import { render, screen } from '@testing-library/react';
import MobileMenuIcon from '../MobileMenuIcon';

describe('MobileMenuIcon component', () => {
    it('renders a single <svg>', () => {
        // utilizing 'container' to get <svg> since the <svg> does not
        // have a default aria role so unable to 'getByRole()'
        const { container } = render(<MobileMenuIcon isOpen={false} />);
        expect(container.querySelectorAll('svg')).toHaveLength(1);
    });

    it('renders the menu icon when menu is closed', () => {
        render(<MobileMenuIcon isOpen={false} />);
        expect(screen.getByTestId('menu-icon')).toBeDefined();
    });

    it('renders the close icon when menu is open', () => {
        render(<MobileMenuIcon isOpen={true} />);
        expect(screen.getByTestId('close-icon')).toBeDefined();
    });

    it('does not render the menu icon when menu is open', () => {
        render(<MobileMenuIcon isOpen={true} />);
        expect(screen.queryByTestId('menu-icon')).toBeNull();
    });

    it('does not render the close icon when menu is closed', () => {
        render(<MobileMenuIcon isOpen={false} />);
        expect(screen.queryByTestId('close-icon')).toBeNull();
    });

    it('displays "Open Menu" as title when menu is closed', () => {
        render(<MobileMenuIcon isOpen={false} />);
        expect(screen.getByTitle('Open Menu')).toBeDefined();
    });

    it('displays "Close" as title when menu is open', () => {
        render(<MobileMenuIcon isOpen={true} />);
        expect(screen.getByTitle('Close')).toBeDefined();
    });
});
