import { Button } from "antd";
import { ROUTES } from "../../routes/routes.config";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();
    const closeSession = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("refreshTokenExpiresAt");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("user");


        navigate(ROUTES.LOGIN);
    }
    return (
        <div>
            <h1>PokeDex</h1>
            <Button type="primary" htmlType="submit" onClick={closeSession}>
                Close Session
            </Button>
            
    
        </div>
    )
}
