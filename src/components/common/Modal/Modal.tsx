import { Modal as AntdModal } from 'antd';

export default function Modal({ children, open, onClose, footer, width, title }: { children: React.ReactNode, open: boolean, onClose: () => void, footer: React.ReactNode | null, width: number, title: string }) {
    return (
        <AntdModal 
            data-testid="modal"
            open={open} 
            onCancel={onClose} 
            footer={footer} 
            width={width} 
            title={title}
        >   
            <div data-testid="modal-content">
                {children}
            </div>
        </AntdModal>
    )
}