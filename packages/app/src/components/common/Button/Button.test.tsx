import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
    const BUTTON_TEXT = 'Test Button';

    it('renders a single <button>', () => {
        const { container } = render(<Button>{BUTTON_TEXT}</Button>);
        expect(container.querySelectorAll('button')).toHaveLength(1);
    });

    it('renders a default <button>', () => {
        const { container } = render(<Button></Button>);
        const button = container.querySelector('button[type="button"]');
        expect(button).toBeTruthy();
    });

    it('secondary variant has a subtle bg color', () => {
        const { getByText } = render(<Button variant="secondary">{BUTTON_TEXT}</Button>);
        const button = getByText(BUTTON_TEXT);
        expect(button.classList.contains('bg-gray-100')).toBe(true);
    });

    it('fires click handler when clicked', () => {
        const handler = jest.fn();
        const { getByText } = render(<Button clickAction={handler}>{BUTTON_TEXT}</Button>);
        const button = getByText(BUTTON_TEXT);
        user.click(button);
        expect(handler).toHaveBeenCalled();
    });
});
