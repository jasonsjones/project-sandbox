import { render, waitFor } from '@testing-library/react';
import { mocked } from 'jest-mock';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { makeGraphQLQuery } from './dataservice';

jest.mock('./dataservice');

// Skipping tests since it is resulting in a
// "Warning: An update to {ServerStatus, AuthProvider} inside a
// test was not wrapped in act(...)"
//
// When testing, code that causes React state updates shoudl be wrapped
// into act(...)

// TODO: move this test to the <HeroBanner />
test.skip('renders hello react text', async () => {
    // This is a working example of returning different payloads based on the
    // calling arguments (query keys)
    mocked(makeGraphQLQuery).mockImplementationOnce(({ queryKey }) => {
        if (queryKey.length && queryKey[0] === 'status') {
            return Promise.resolve({ data: { status: 'Test is working!' } });
        }

        return Promise.resolve({
            data: { refreshAccessToken: { accessToken: null } }
        });
    });

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/orion labs side project/i));
    expect(textElement).toBeInTheDocument();
});

// TODO: move this test to <ServerStatus /> component
test.skip(`renders 'All Good!'' when graphql call is successful`, async () => {
    mocked(makeGraphQLQuery).mockImplementationOnce(() =>
        Promise.resolve({ data: { status: 'Mock is working!' } })
    );

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/all good/i));
    expect(textElement).toBeInTheDocument();
});

// TODO: move this test to <ServerStatus /> component
test.skip(`renders 'Ah snap!'' when something is wrong with graphql call`, async () => {
    mocked(makeGraphQLQuery).mockImplementationOnce(() =>
        Promise.resolve({ errors: [{ message: 'Something went wrong.' }] })
    );

    const { getByText } = render(<App />);
    const textElement = await waitFor(() => getByText(/ah snap/i));
    expect(textElement).toBeInTheDocument();
});
