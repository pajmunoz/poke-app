import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
    it('should render with children', () => {
        render(<Button onClick={() => { }} disabled={false}>Click me</Button>);

        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick} disabled={false}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be enabled when disabled prop is false', () => {
        render(<Button onClick={() => { }} disabled={false}>Click me</Button>);

        const button = screen.getByText('Click me');
        expect(button).not.toBeDisabled();
    });

    it('should render with different children content', () => {
        render(<Button onClick={() => { }} disabled={false}>Submit Form</Button>);

        expect(screen.getByText('Submit Form')).toBeInTheDocument();
    });

    it('should not call onClick when disabled and clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick} disabled={true}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));

        expect(handleClick).not.toHaveBeenCalled();
    });
});
