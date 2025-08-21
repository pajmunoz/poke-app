import { Input as AntdInput } from "antd";

interface InputProps {
    onChange: (e: any) => void;
    name: string;
    value: string;
    disabled?: boolean;
    type?: string;
    placeholder?: string;
}

export default function Input({ onChange, name, value, disabled, type, placeholder }: InputProps) {
    return (
        <AntdInput 
            onChange={onChange} 
            name={name} 
            value={value}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
        />
    )
}