import { Form, Input, Button, Divider } from 'antd';
import { useState } from 'react';
import "./LoginForm.css";
import ScrollVelocity from '../../snippets/ScrollVelocity/ScrollVelocity';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

interface LoginFormProps {
    onSubmit: (values: { username: string; password: string }) => void;
    isLoading?: boolean;
    initialValues?: { username: string; password: string };
}

export default function LoginForm({ onSubmit, isLoading = false, initialValues = { username: '', password: '' } }: LoginFormProps) {
    const [formValues, setFormValues] = useState(initialValues);

    // Sincronizar formValues con initialValues cuando cambien

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
        <div className="login-form-container">
            <div className="title-container">
                <ScrollVelocity
                    texts={['Please Login', 'Login Please']}
                    velocity={10}
                    className="title"
                />
            </div>
            <Form data-testid="login-form" className="login-form">

                <Form.Item name="username">
                    <Input
                        style={{ fontSize: '3em', textAlign: 'center' }}
                        variant="borderless"
                        size="large"
                        data-testid="username-input"
                        onChange={handleChange}
                        name="username"
                        value={formValues.username}
                        disabled={isLoading}
                        placeholder="Username"
                    />
                </Form.Item>
                <Divider />
                <Form.Item name="password">
                    <Input
                        style={{ fontSize: '3em', textAlign: 'center' }}
                        variant="borderless"
                        size="large"
                        data-testid="password-input"
                        onChange={handleChange}
                        name="password"
                        value={formValues.password}
                        type="password"
                        disabled={isLoading}
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        color="cyan" 
                        variant="filled"
                        size="large"
                        style={{ fontSize: '1.5em', textAlign: 'center', width: '200px' }}
                        data-testid="login-button"
                        onClick={handleSubmit}
                        disabled={isDisabled || isLoading}
                    
                    >
                        {isLoading ? "Connecting to server..." : "Login"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
