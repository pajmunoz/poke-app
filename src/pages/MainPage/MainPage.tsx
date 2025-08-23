import { Button, Col, Divider, Flex, Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Modal from "../../components/common/Modal/Modal";
import { ROUTES } from "../../routes/routes.config";
import { useNavigate } from "react-router-dom";
import PokemonList from "../../components/pokemon/PokemonList/PokemonList";
import "./MainPage.css";
import ScrollVelocity from "../../snippets/ScrollVelocity/ScrollVelocity";
import { useState } from "react";

export default function MainPage() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const closeSession = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("refreshTokenExpiresAt");
        setShowLogoutModal(false);
        navigate(ROUTES.LOGIN);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div data-testid="main-page" className="main-page">
            <div className="main-page-header">
                <ScrollVelocity
                    texts={['Find your favorite Pokemon', ' Pokemon Find your favorite']}
                    velocity={10}
                    className="title"
                />
            </div>

            <Button
                type="primary"
                danger
                onClick={closeSession}
                icon={<CloseOutlined />}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
            />




            <Divider />

            <PokemonList />

            {/* Modal de confirmación de logout */}
            <Modal
                open={showLogoutModal}
                onClose={cancelLogout}
                title="Confirm Logout"
                width={400}
                footer={
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button onClick={cancelLogout}>
                            Cancel
                        </Button>
                        <Button type="primary" danger onClick={confirmLogout}>
                            Close Session
                        </Button>
                    </div>
                }
            >
                <p>Are you sure you want to close your session?</p>
                <p>All your session data will be deleted.</p>
            </Modal>
        </div>
    );
}
