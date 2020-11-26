import React from 'react';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';
import InputField from './InputField';

const generalProps = {
    id: 'test',
    value: 'test value',
    label: 'Test label',
    changeHandler: () => {}
};

describe('InputField component', () => {
    afterEach(cleanup);

    it('renders a single <div>', () => {
        const { container } = render(<InputField {...generalProps} />);
        expect(container.querySelectorAll('div')).toHaveLength(1);
    });

    it('with default props renders a single label and input', () => {
        const { container } = render(<InputField {...generalProps} />);
        expect(container.querySelectorAll('label')).toHaveLength(1);
        expect(container.querySelectorAll('input')).toHaveLength(1);
    });

    it('displays an input of the provided type', () => {
        const { getByLabelText } = render(<InputField {...generalProps} type="email" />);
        expect(getByLabelText(generalProps.label).getAttribute('type')).toBe('email');
    });

    it('displays the label value', () => {
        const { getByText } = render(<InputField {...generalProps} />);
        expect(getByText(generalProps.label)).toBeTruthy();
    });

    it(`calls 'changeHandler' prop when value changes`, async () => {
        const handleChange = jest.fn();
        const { getByLabelText } = render(
            <InputField {...generalProps} changeHandler={handleChange} />
        );
        const input = getByLabelText(generalProps.label);
        await user.type(input, 'oliver@');
        expect(handleChange).toHaveBeenCalled();
    });
});
