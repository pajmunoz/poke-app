import { Form, message } from "antd";
import Header from "../../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import { loginUser, LoginCredentials } from "../../api/authAPI";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [formValues, setFormValues] = useState({ username: "", password: "" });
    const [messageApi, contextHolder] = message.useMessage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        setIsDisabled(!formValues.username || !formValues.password);
    }, [formValues]);

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        setIsAuthenticated(false);

        try {
            const response = await loginUser({
                username: values.username,
                password: values.password
            });

            // El servidor no envía 'success' pero sí envía 'token' y mensaje de éxito
            const isSuccess = response && (
                response.success === true || 
                (response.token && response.message && response.message.toLowerCase().includes('exitoso'))
            );

            if (isSuccess) {
                setIsAuthenticated(true);
                
                // Guardar datos de autenticación
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("username", values.username);
                localStorage.setItem("password", values.password);
                localStorage.setItem("user", JSON.stringify(values));
                
                // Guardar token del servidor si existe
                if (response.token) {
                    localStorage.setItem("token", response.token);
                }
                
                // Guardar información del usuario del servidor si existe
                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                }
                
                // Establecer expiración (24 horas por defecto)
                localStorage.setItem("expiresAt", new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString());
                
                // Refresh token si existe
                if (response.token) {
                    localStorage.setItem("refreshToken", response.token);
                    localStorage.setItem("refreshTokenExpiresAt", new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString());
                }

                messageApi.success("Login successful!");
                navigate("/main");
                setFormValues({ username: "", password: "" });
            } else {
                setIsAuthenticated(false);
                const errorMsg = response?.message || "Login failed";
                messageApi.error(errorMsg);
            }
        } catch (error) {
            setIsAuthenticated(false);
            
            if (error instanceof Error) {
                if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
                    messageApi.error("Cannot connect to server. Please check if the server is running on port 3000.");
                } else {
                    messageApi.error(error.message || "Login failed. Please try again.");
                }
            } else {
                messageApi.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {contextHolder}
            <Header />

            <Form>
                <Form.Item label="Username" name="username">
                    <Input 
                        onChange={handleChange} 
                        name="username" 
                        value={formValues.username}
                        disabled={isLoading}
                    />
                </Form.Item>
                <Form.Item label="Password" name="password" >
                    <Input 
                        onChange={handleChange} 
                        name="password" 
                        value={formValues.password}
                        type="password"
                        disabled={isLoading}
                    />
                </Form.Item>
                <Form.Item>
                    <Button 
                        onClick={() => onSubmit(formValues)} 
                        disabled={isDisabled || isLoading}
                    > 
                        {isLoading ? "Connecting to server..." : "Login"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
} 
