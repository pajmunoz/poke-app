import { Form, message } from "antd";
import Header from "../../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";

export default function LoginPage() {
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [formValues, setFormValues] = useState({ username: "", password: "" });
    const [messageApi, contextHolder] = message.useMessage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const userCredentials = {
        username: "admin",
        password: "123456"
    }

    const handleChange = (e: any) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        setIsDisabled(!formValues.username || !formValues.password);
    }, [formValues]);


    const onSubmit = (values: any) => {
        if (values.username === userCredentials.username && values.password === userCredentials.password) {
            setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", values.username);
        localStorage.setItem("password", values.password);
        localStorage.setItem("user", JSON.stringify(values));
        localStorage.setItem("token", "1234567890");
        localStorage.setItem("expiresAt", new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString());
        localStorage.setItem("refreshToken", "1234567890");
        localStorage.setItem("refreshTokenExpiresAt", new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString());
            console.log(values);
            navigate("/main");
            setFormValues({ username: "", password: "" });
        } else {
            setIsAuthenticated(false);
            messageApi.error("Invalid credentials");
        }

    }



    return (
        <div>
            {contextHolder}
                <Header />

            <Form>
                <Form.Item label="Username" name="username">
                    <Input onChange={handleChange} name="username" value={formValues.username} />

                </Form.Item>
                <Form.Item label="Password" name="password" >
                    <Input onChange={handleChange} name="password" value={formValues.password} />
                </Form.Item>
                <Form.Item>
                    <Button onClick={() => onSubmit(formValues)} disabled={isDisabled}> 
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
} 
