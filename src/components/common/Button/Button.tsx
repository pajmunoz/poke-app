import { Button as AntdButton } from "antd";

export default function Button({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled: boolean }) {
    return (
        <AntdButton type="primary" htmlType="submit" onClick={onClick} disabled={disabled}>
            {children}
        </AntdButton>
    )
}