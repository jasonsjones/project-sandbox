import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// global.fetch = jest.fn(() =>
//     Promise.resolve({
//         json: () => Promise.resolve({ data: { status: 'Test is working' } })
//     })
// );

test('renders hello react text', async () => {
    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/hello react/i));
    expect(textElement).toBeInTheDocument();
});
