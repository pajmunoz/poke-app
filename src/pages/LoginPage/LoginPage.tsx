import { Divider, message, Button } from "antd";
import Header from "../../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import { loginUser } from "../../api/authAPI";
import Modal from "../../components/common/Modal/Modal";

export default function LoginPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);


    const onSubmit = async (values: any) => {
        setIsLoading(true);

        try {
            const response = await loginUser({
                username: values.username,
                password: values.password
            });

            // El servidor no envía 'success' pero sí envía 'token' y mensaje de éxito
            const isSuccess = response && (
                response.success === true
            );

            if (isSuccess) {
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

                messageApi.success("Login exitoso!");
                setTimeout(() => {
                    navigate("/main");
                }, 1000);

            } else {
                const errorMsg = response?.message || "Login fallido";
                messageApi.error(errorMsg);
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
                    messageApi.error("No se puede conectar al servidor. Por favor, verifique si el servidor está corriendo en el puerto 3000.");
                } else {
                    messageApi.error(error.message || "Login fallido. Por favor, intente nuevamente.");
                }
            } else {
                messageApi.error("Ocurrió un error inesperado. Por favor, intente nuevamente.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Header />
      
            {contextHolder}

            {/* Botón para mostrar credenciales */}
            <div style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                marginBottom: '20px'
            }}>
                <Button 
                    type="dashed" 
                    onClick={() => setShowCredentialsModal(true)}
                    style={{ fontSize: '12px' }}
                >
                    ¿Olvidaste las credenciales?
                </Button>
            </div>

            <LoginForm
                onSubmit={onSubmit}
                isLoading={isLoading}
            />

            {/* Modal con credenciales */}
            <Modal
                open={showCredentialsModal}
                onClose={() => setShowCredentialsModal(false)}
                title="Credenciales de Administrador"
                width={400}
                footer={null}
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h3 style={{ color: '#1890ff', marginBottom: '20px' }}>
                        Usuario: <strong>admin</strong>
                    </h3>
                    <h3 style={{ color: '#1890ff', marginBottom: '20px' }}>
                        Contraseña: <strong>admin</strong>
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Usa estas credenciales para acceder a la aplicación
                    </p>
                </div>
            </Modal>
        </div>
    );
} 
