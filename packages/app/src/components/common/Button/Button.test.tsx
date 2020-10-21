import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import Button from './Button';

describe('Button component', () => {
    it('renders a <button>', () => {
        const { container } = render(<Button>Test Button</Button>);
        expect(container.firstChild?.nodeName).toEqual('BUTTON');
    });

    it('fires click handler when clicked', () => {
        expect.assertions(1);

        const handler = jest.fn();
        const { getByText } = render(<Button clickAction={handler}>Test Button</Button>);
        const button = getByText('Test Button');
        user.click(button);
        expect(handler).toHaveBeenCalled();
    });
});
