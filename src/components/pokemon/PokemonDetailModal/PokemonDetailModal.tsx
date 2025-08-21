

import {Typography, Row, Col, Tag, Statistic, Divider, Image, Space } from 'antd';
import { formatPokemonName, formatHeight, formatWeight } from '../../../utils/helpers';
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
    if (!pokemon) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            footer={null}
            width={800}
            title={formatPokemonName(pokemon.name)}
        >
            <div className="pokemon-detail-modal" style={{ padding: '20px 0' }}>
                {/* Imagen y tipos */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12} className="pokemon-image-container">
                        <Image
                            src={pokemon.image}
                            alt={pokemon.name}
                            width={200}
                            height={200}
                            style={{ objectFit: 'contain' }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />
                        <div className="pokemon-id">
                            <Text type="secondary">#{pokemon.id.toString().padStart(3, '0')}</Text>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="types-abilities-container">
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
                        </div>
                    </Col>
                </Row>

                <Divider />

                {/* Estadísticas físicas */}
                <Row gutter={[24, 24]} className="physical-stats">
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Height"
                            value={formatHeight(pokemon.height || 0)}
                            suffix=""
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Weight"
                            value={formatWeight(pokemon.weight || 0)}
                            suffix=""
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="ID"
                            value={pokemon.id}
                            suffix=""
                        />
                    </Col>
                </Row>

                {/* Movimientos */}
                {pokemon.moves && Array.isArray(pokemon.moves) && pokemon.moves.length > 0 && (
                    <>
                        <Divider />
                        <Title level={4}>Moves</Title>
                        <div className="moves-grid">
                            <Row gutter={[8, 8]}>
                                {pokemon.moves.map((move, index) => {
                                    if (!move || typeof move !== 'object') {
                                        return null;
                                    }
                                    
                                    const moveName = move.name || 'Unknown Move';
                                    const moveType = move.type || 'Unknown Type';
                                    const movePower = move.power;
                                    const moveAccuracy = move.accuracy;
                                    
                                    return (
                                        <Col key={`move-${index}`} xs={24} sm={12} md={8}>
                                            <div className="move-card">
                                                <div className="move-name">
                                                    <Text strong>
                                                        {formatPokemonName(moveName)}
                                                    </Text>
                                                </div>
                                                <div className="move-details">
                                                    <Tag color="purple" className="move-type-tag">
                                                        {formatPokemonName(moveType)}
                                                    </Tag>
                                                    <div className="move-stats">
                                                        {movePower !== null && movePower !== undefined && (
                                                            <Text type="secondary">
                                                                Power: {movePower}
                                                            </Text>
                                                        )}
                                                        {moveAccuracy !== null && moveAccuracy !== undefined && (
                                                            <Text type="secondary">
                                                                Acc: {moveAccuracy}%
                                                            </Text>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    </>
                )}

                {/* Formas */}
                {pokemon.forms && Array.isArray(pokemon.forms) && pokemon.forms.length > 0 && (
                    <>
                        <Divider />
                        <Title level={4}>Forms</Title>
                        <div className="forms-grid">
                            <Row gutter={[8, 8]}>
                                {pokemon.forms.map((form, index) => {
                                    if (!form || typeof form !== 'object' || !form.name) {
                                        return null;
                                    }
                                    
                                    return (
                                        <Col key={`form-${index}`} xs={12} sm={8} md={6}>
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
                    </>
                )}

                {/* Estadísticas de batalla */}
                {pokemon.stats && (
                    <>
                        <Divider />
                        <Title level={4}>Battle Stats</Title>
                        <Row gutter={[16, 16]} className="stats-grid">
                            <Col xs={24} sm={12} md={8}>
                                <Statistic
                                    title="HP"
                                    value={pokemon.stats.hp}
                                    suffix=""
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Statistic
                                    title="Attack"
                                    value={pokemon.stats.attack}
                                    suffix=""
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Statistic
                                    title="Defense"
                                    value={pokemon.stats.defense}
                                    suffix=""
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Statistic
                                    title="Speed"
                                    value={pokemon.stats.speed}
                                    suffix=""
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Statistic
                                    title="Sp. Attack"
                                    value={pokemon.stats.specialAttack}
                                    suffix=""
                                    valueStyle={{ color: '#fa8c16' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Statistic
                                    title="Sp. Defense"
                                    value={pokemon.stats.specialDefense}
                                    suffix=""
                                    valueStyle={{ color: '#13c2c2' }}
                                />
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </Modal>
    );
}
