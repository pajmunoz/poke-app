import Title from "antd/es/typography/Title";

import "./Header.css";
export default function Header() {
    return (
        <div data-testid="header" className="header">
            <Title level={2}>PokeDex</Title>
        </div>
    );
}