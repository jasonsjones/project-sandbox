import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { makeGraphQLQuery } from './dataservice';

jest.mock('./dataservice');

test('renders hello react text', async () => {
    mocked(makeGraphQLQuery).mockImplementation(() =>
        Promise.resolve({ data: { status: 'Test is working!' } })
    );

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/orion labs side project/i));
    expect(textElement).toBeInTheDocument();
});

test(`renders 'All Good!'' when graphql call is successful`, async () => {
    mocked(makeGraphQLQuery).mockImplementation(() =>
        Promise.resolve({ data: { status: 'Mock is working!' } })
    );

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/all good/i));
    expect(textElement).toBeInTheDocument();
});

test(`renders 'Ah snap!'' when something is wrong with graphql call`, async () => {
    mocked(makeGraphQLQuery).mockImplementation(() =>
        Promise.resolve({ errors: { message: 'Something went wrong.' } })
    );

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/ah snap/i));
    expect(textElement).toBeInTheDocument();
});
