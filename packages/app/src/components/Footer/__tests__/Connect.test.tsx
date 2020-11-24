import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Connect from '../Connect';

describe('Connect (footer) component', () => {
    afterEach(cleanup);

    it('renders a Connect section', () => {
        const { getByText } = render(<Connect />);
        expect(getByText('Connect')).toBeTruthy();
    });

    it('offers link to github', () => {
        const { getByTestId } = render(<Connect />);
        expect(getByTestId('connect on github')).toBeTruthy();
    });

    it('offers link to twitter', () => {
        const { getByTestId } = render(<Connect />);
        expect(getByTestId('connect on twitter')).toBeTruthy();
    });
});
