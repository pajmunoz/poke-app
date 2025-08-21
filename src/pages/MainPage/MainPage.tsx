import { Button } from "antd";
import { ROUTES } from "../../routes/routes.config";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
    const navigate = useNavigate();
    const closeSession = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        navigate(ROUTES.LOGIN);
    }
    return (
        <div>
            PokeDex
            <Button type="primary" htmlType="submit" onClick={closeSession}>
                Close Session
            </Button>
        </div>
    )
}
