import { Card } from "antd";
import { formatPokemonName } from "../../../utils/helpers";

interface PokemonCardProps {
    pokemon: any;
    onClick?: (pokemon: any) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(pokemon);
            console.log(pokemon);
        }
      
    };

    return (
        <Card 
            hoverable 
            onClick={handleClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <h1>{formatPokemonName(pokemon.name)}</h1>
            <img style={{ width: '100px', height: '100px' }} src={pokemon.image} alt={pokemon.name} />
        </Card>
    )
}