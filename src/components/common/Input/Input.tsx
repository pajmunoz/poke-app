import { Input as AntdInput } from "antd";

export default function Input({ onChange, name, value }: { onChange: (e: any) => void, name: string, value: string }) {
    return (
        <AntdInput onChange={onChange} name={name} value={value} />
    )
}