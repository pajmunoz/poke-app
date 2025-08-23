import Title from "antd/es/typography/Title";
import "./Header.css";
import { DownOutlined } from "@ant-design/icons";
import bg from '../../assets/img/bg-red.svg';
import ball from '../../assets/img/pokeball-red.png';

export default function Header() {
    const logo = 'https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg'
    return (
        <div data-testid="header" className="header" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <figure className="logo">
                <img src={logo} alt="bg"  />
            </figure>
            <figure className="ball">
                <img src={ball} alt="pokeball" />
            </figure>
            <div className="content">
                <Title style={{ color: 'white', fontWeight: 'bold', fontSize: '2.5em', minWidth: '100px' }}>PokeDex</Title>
                <div className="scroll-down">
                    <DownOutlined style={{ fontSize: '5em', cursor: 'pointer', color: 'white' }} onClick={() => {
                        window.scrollTo({
                            top: 1000,
                            behavior: 'smooth'
                        })
                    }} />
                </div>
            </div>
        </div>
    );
}