import { Card } from "antd";
import { formatPokemonName } from "../../../utils/helpers";
import { Meta } from "antd/es/list/Item";

interface PokemonCardProps {
    pokemon: any;
    onClick?: (pokemon: any) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(pokemon);
        }

    };

    return (
        <Card
            hoverable
            onClick={handleClick}
            style={{ 
                cursor: onClick ? 'pointer' : 'default', 
                height: '100%', 
                padding: '0 1em',
                maxWidth: '100%',
                minHeight: '300px'
            }}
            cover={<img src={pokemon.image} alt={pokemon.name} style={{ objectFit: 'contain', padding: '0.5em', width: '100%', height: 'auto' }} />}
            title={formatPokemonName(pokemon.name)}
        >
            <Meta description={pokemon.id.toString().padStart(3, '0')} style={{ padding: '1em 0', position: 'absolute', bottom: 0, fontWeight: 'bold'}}/>
        </Card>
    )
}