import React from 'react';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';
import Toggle from './Toggle';

const generalProps = {
    label: 'Test label',
    changeHandler: () => {}
};

describe('Toggle component', () => {
    afterEach(cleanup);

    it('with default props renders a single label and input', () => {
        const { container } = render(<Toggle {...generalProps} />);
        expect(container.querySelectorAll('label')).toHaveLength(1);
        expect(container.querySelectorAll('input')).toHaveLength(1);
    });

    it('displays the label value', () => {
        const { getByText } = render(<Toggle {...generalProps} />);
        expect(getByText(generalProps.label)).toBeTruthy();
    });

    it(`calls 'changeHandler' prop when value changes`, async () => {
        const handleChange = jest.fn();
        const { getByLabelText } = render(
            <Toggle label={generalProps.label} changeHandler={handleChange} />
        );
        const input = getByLabelText(generalProps.label);
        await user.click(input);
        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
