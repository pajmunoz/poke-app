import { Card } from "antd";
export default function PokemonCard({ pokemon }: { pokemon: any }) {
    return (
        <Card>
            <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
            <img style={{ width: '100px', height: '100px' }} src={pokemon.image} alt={pokemon.name} />
        </Card>
    )
}