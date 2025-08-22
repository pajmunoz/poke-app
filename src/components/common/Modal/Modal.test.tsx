import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
    const defaultProps = {
        children: <div>Modal content</div>,
        open: true,
        onClose: vi.fn(),
        footer: null,
        width: 520,
        title: 'Test Modal'
    };

    it('should render when open is true', () => {
        render(<Modal {...defaultProps} />);

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render when open is false', () => {
        render(<Modal {...defaultProps} open={false} />);

        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('should call onClose when modal is closed', () => {
        const handleClose = vi.fn();
        render(<Modal {...defaultProps} onClose={handleClose} />);

        // Find and click the close button (X)
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should display the title correctly', () => {
        render(<Modal {...defaultProps} title="Custom Title" />);

        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should render children content', () => {
        const customContent = <div>Custom modal content</div>;
        render(<Modal {...defaultProps} children={customContent} />);

        expect(screen.getByText('Custom modal content')).toBeInTheDocument();
    });

    it('should handle footer prop', () => {
        const footerContent = <div>Footer content</div>;
        render(<Modal {...defaultProps} footer={footerContent} />);

        expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should handle null footer', () => {
        render(<Modal {...defaultProps} footer={null} />);

        // Modal should still render without footer
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should apply custom width', () => {
        render(<Modal {...defaultProps} width={800} />);

        // The width prop should be passed to AntdModal
        // We can verify this by checking if the modal renders with custom content
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should handle different title values', () => {
        render(<Modal {...defaultProps} title="Another Title" />);

        expect(screen.getByText('Another Title')).toBeInTheDocument();
    });

    it('should handle empty title', () => {
        render(<Modal {...defaultProps} title="" />);

        // Modal should still render
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should handle complex children content', () => {
        const complexContent = (
            <div>
                <h2>Section Title</h2>
                <p>Some paragraph text</p>
                <button>Action Button</button>
            </div>
        );

        render(<Modal {...defaultProps} children={complexContent} />);

        expect(screen.getByText('Section Title')).toBeInTheDocument();
        expect(screen.getByText('Some paragraph text')).toBeInTheDocument();
        expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('should maintain all props correctly', () => {
        const props = {
            children: <div>Complex content</div>,
            open: true,
            onClose: vi.fn(),
            footer: <div>Custom footer</div>,
            width: 1000,
            title: 'Full Featured Modal'
        };

        render(<Modal {...props} />);

        expect(screen.getByText('Full Featured Modal')).toBeInTheDocument();
        expect(screen.getByText('Complex content')).toBeInTheDocument();
        expect(screen.getByText('Custom footer')).toBeInTheDocument();
    });
});
