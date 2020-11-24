import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Footer from '../';

describe('Footer component', () => {
    afterEach(cleanup);

    it('renders a footer element', () => {
        const { container } = render(<Footer />);
        expect(container.querySelectorAll('footer')).toHaveLength(1);
    });
});
