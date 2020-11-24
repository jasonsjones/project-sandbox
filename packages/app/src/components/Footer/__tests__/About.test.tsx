import React from 'react';
import { render, cleanup } from '@testing-library/react';
import About from '../About';

describe('About (footer) component', () => {
    afterEach(cleanup);

    it('renders an About section', () => {
        const { getByText } = render(<About />);
        expect(getByText('About')).toBeTruthy();
    });
});
