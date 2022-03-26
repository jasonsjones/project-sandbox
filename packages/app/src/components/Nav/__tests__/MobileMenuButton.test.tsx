import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import MobileMenuButton from '../MobileMenuButton';

describe('MobileMenuButton component', () => {
    it('renders a <button>', () => {
        render(
            <MobileMenuButton
                isTriggered={false}
                clickAction={() => {
                    /* empty */
                }}
            />
        );
        expect(screen.getByRole('button')).toBeDefined();
    });

    it('fires click handler when clicked', () => {
        const handler = jest.fn();
        render(<MobileMenuButton isTriggered={false} clickAction={handler} />);
        const button = screen.getByRole('button');
        user.click(button);
        expect(handler).toHaveBeenCalledTimes(1);
    });
});
