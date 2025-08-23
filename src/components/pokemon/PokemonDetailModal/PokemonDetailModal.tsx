

import { Typography, Row, Col, Tag, Divider, Image, Button } from 'antd';
import { formatPokemonName } from '../../../utils/helpers';
import Modal from '../../common/Modal/Modal';
import './PokemonDetailModal.css';

const { Title, Text } = Typography;

interface Pokemon {
    id: number;
    name: string;
    types?: string[];
    image?: string;
    height?: number;
    weight?: number;
    abilities?: string[];
    moves?: Array<{
        name: string;
        type: string;
        power: number | null;
        accuracy: number | null;
    }>;
    forms?: Array<{
        name: string;
        url: string;
    }>;
    stats?: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
        specialAttack: number;
        specialDefense: number;
    };
}

interface PokemonDetailModalProps {
    pokemon: Pokemon | null;
    open: boolean;
    onClose: () => void;
}

export default function PokemonDetailModal({ pokemon, open, onClose }: PokemonDetailModalProps) {
    console.log('pokemon', pokemon);
    if (!pokemon) return null;

    // Función para obtener el color del tipo del Pokémon
    const getTypeColor = (types: string[] | undefined) => {
        if (!types || types.length === 0) {
            return '#A8A878'; // Color por defecto (normal)
        }

        const primaryType = types[0];
        const typeColors: { [key: string]: string } = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };

        return typeColors[primaryType.toLowerCase()] || '#A8A878';
    };

    const typeColor = getTypeColor(pokemon.types);

    return (
        <Modal
            open={open}
            onClose={onClose}
            footer={null}
            width={600}
            title=""
        >
            <div data-testid="pokemon-detail-modal" className="pokemon-detail-modal">
                {/* Imagen y tipos */}
                <Row gutter={[24, 24]}>

                    <Col xs={24} md={6} className="pokemon-image-container">
                        <div className="poke-color-type" style={{ backgroundColor: typeColor }}></div>
                        <Image
                            src={pokemon.image}
                            alt={pokemon.name}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'contain', maxWidth: '180px' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />

                    </Col>
                    <Col xs={24} md={18}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', marginBottom: '1em' }}>
                            <Text strong style={{ fontSize: '2em', marginRight: '1em' }}>{formatPokemonName(pokemon.name)}</Text>

                            <Text type="secondary" style={{ fontSize: '1.5em' }}>#{pokemon.id.toString().padStart(3, '0')}</Text>

                        </div>

                        <div className="content-container">
                            <div className="measures-section">
                                <Text strong>Height:</Text>
                                <Text type="secondary">{pokemon.height} m</Text>

                            </div>
                            <div className="measures-section">
                                <Text strong>Weight:</Text>
                                <Text type="secondary">{pokemon.weight} kg</Text>
                            </div>
                            <div className="type-section">
                                <Text strong>Types:</Text>
                                <div className="type-tags">
                                    {pokemon.types?.map((type, index) => (
                                        <Tag
                                            key={index}
                                            color="blue"
                                            className="type-tag"
                                        >
                                            {formatPokemonName(type)}
                                        </Tag>
                                    )) || <Text type="secondary">No types available</Text>}
                                </div>
                            </div>

                            <div className="ability-section">
                                <Text strong>Abilities:</Text>
                                <div className="ability-tags">
                                    {pokemon.abilities?.map((ability, index) => (
                                        <Tag
                                            key={index}
                                            color="green"
                                            className="ability-tag"
                                        >
                                            {formatPokemonName(ability)}
                                        </Tag>
                                    )) || <Text type="secondary">No abilities available</Text>}
                                </div>
                            </div>

                            {/* Movimientos */}
                            {pokemon.moves && Array.isArray(pokemon.moves) && pokemon.moves.length > 0 && (
                                <div className="moves-section">
                                    <Text strong>Moves:</Text>
                                    <div className="moves-grid">
                                        <Row gutter={[8, 8]}>
                                            {pokemon.moves.map((move, index) => {
                                                if (!move || typeof move !== 'object') {
                                                    return null;
                                                }
                                                const moveType = move.type || 'Unknown Type';
                                                return (
                                                    <Tag color="purple" className="move-type-tag">
                                                        {formatPokemonName(moveType)}
                                                    </Tag>
                                                );
                                            })}
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {/* Formas */}
                            {pokemon.forms && Array.isArray(pokemon.forms) && pokemon.forms.length > 0 && (
                                <div className="forms-section">
                                    <Text strong>Forms:</Text>
                                    <div className="forms-grid">
                                        <Row gutter={[8, 8]}>
                                            {pokemon.forms.map((form, index) => {
                                                if (!form || typeof form !== 'object' || !form.name) {
                                                    return null;
                                                }

                                                return (
                                                    <Col key={`form-${index}`}>
                                                        <Tag
                                                            color="orange"
                                                            className="form-tag"
                                                        >
                                                            {formatPokemonName(form.name)}
                                                        </Tag>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
}
