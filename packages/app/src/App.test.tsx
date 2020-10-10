import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

beforeEach(() => {
    fetchMock.resetMocks();
});

test('renders hello react text', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { status: 'Test is working' } }));

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/hello react/i));
    expect(textElement).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
});

test(`renders 'All Good!'' when graphql call is successful`, async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { status: 'Test is working' } }));

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/all good/i));
    expect(textElement).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
});

test(`renders 'Ah snap!'' when something is wrong with graphql call`, async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: { status: 'Something went wrong...' } }));

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/ah snap/i));
    expect(textElement).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
});
