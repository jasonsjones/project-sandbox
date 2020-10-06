import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders hello react text', () => {
    const { getByText } = render(<App />);
    const textElement = getByText(/hello react/i);
    expect(textElement).toBeInTheDocument();
});
