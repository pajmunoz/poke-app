import { Button, Divider } from "antd";
import { ROUTES } from "../../routes/routes.config";
import { useNavigate } from "react-router-dom";
import PokemonList from "../../components/pokemon/PokemonList/PokemonList";
import Title from "antd/es/typography/Title";
import "./MainPage.css";

export default function MainPage() {
    const navigate = useNavigate();

    const closeSession = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("refreshTokenExpiresAt");
        navigate(ROUTES.LOGIN);
    };

    return (
        <div data-testid="main-page" className="main-page">

            <Title level={2}>Find your favorite Pokemon</Title>
            <Button type="primary" danger onClick={closeSession}>
                Close Session
            </Button>

            <Divider />

            <PokemonList />
        </div>
    );
}
