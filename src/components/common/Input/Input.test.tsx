import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

describe('Input', () => {
    const defaultProps = {
        onChange: vi.fn(),
        name: 'test-input',
        value: '',
    };

    it('should render with basic props', () => {
        render(<Input {...defaultProps} />);

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('name', 'test-input');
    });

    it('should call onChange when input value changes', () => {
        const handleChange = vi.fn();
        render(<Input {...defaultProps} onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test value' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should display the value prop', () => {
        render(<Input {...defaultProps} value="initial value" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('initial value');
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Input {...defaultProps} disabled={true} />);

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    it('should be enabled when disabled prop is false', () => {
        render(<Input {...defaultProps} disabled={false} />);

        const input = screen.getByRole('textbox');
        expect(input).not.toBeDisabled();
    });

    it('should have correct type attribute', () => {
        render(<Input {...defaultProps} type="password" />);

        const input = screen.getByDisplayValue('');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('should have correct placeholder', () => {
        render(<Input {...defaultProps} placeholder="Enter your name" />);

        const input = screen.getByPlaceholderText('Enter your name');
        expect(input).toBeInTheDocument();
    });

    it('should handle empty placeholder', () => {
        render(<Input {...defaultProps} placeholder="" />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', '');
    });

    it('should handle undefined disabled prop', () => {
        render(<Input {...defaultProps} />);

        const input = screen.getByRole('textbox');
        expect(input).not.toBeDisabled();
    });

    it('should handle undefined type prop', () => {
        render(<Input {...defaultProps} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'text'); // default type
    });

    it('should maintain all props correctly', () => {
        const props = {
            onChange: vi.fn(),
            name: 'username',
            value: 'john_doe',
            disabled: false,
            type: 'email',
            placeholder: 'Enter email'
        };

        render(<Input {...props} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('name', 'username');
        expect(input).toHaveValue('john_doe');
        expect(input).not.toBeDisabled();
        expect(input).toHaveAttribute('type', 'email');
        expect(input).toHaveAttribute('placeholder', 'Enter email');
    });
});
