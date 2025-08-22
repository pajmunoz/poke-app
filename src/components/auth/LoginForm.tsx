import { Form, Input, Button } from 'antd';
import { useState, useEffect } from 'react';
import "./LoginForm.css";

interface LoginFormProps {
    onSubmit: (values: { username: string; password: string }) => void;
    isLoading?: boolean;
    initialValues?: { username: string; password: string };
}

export default function LoginForm({ onSubmit, isLoading = false, initialValues = { username: '', password: '' } }: LoginFormProps) {
    const [formValues, setFormValues] = useState(initialValues);

    // Sincronizar formValues con initialValues cuando cambien
    useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSubmit(formValues);
    };

    const isDisabled = !formValues.username || !formValues.password;

    return (
        <Form data-testid="login-form" className="login-form">
            <Form.Item label="Username" name="username">
                <Input
                    data-testid="username-input"
                    onChange={handleChange}
                    name="username"
                    value={formValues.username}
                    disabled={isLoading}
                    placeholder="Enter username"
                />
            </Form.Item>
            <Form.Item label="Password" name="password">
                <Input
                    data-testid="password-input"
                    onChange={handleChange}
                    name="password"
                    value={formValues.password}
                    type="password"
                    disabled={isLoading}
                    placeholder="Enter password"
                />
            </Form.Item>
            <Form.Item>
                <Button
                    data-testid="login-button"
                    onClick={handleSubmit}
                    disabled={isDisabled || isLoading}
                    type="primary"
                >
                    {isLoading ? "Connecting to server..." : "Login"}
                </Button>
            </Form.Item>
        </Form>
    );
}
