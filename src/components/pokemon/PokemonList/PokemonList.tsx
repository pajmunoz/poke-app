import { Row, Col, Spin, Alert, Button, Typography, Input, Tag } from "antd";
import { ReloadOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { usePokemon } from "../../../hooks/usePokemon";
import PokemonCard from "../PokemonCard/PokemonCard";
import Pagination from "../../common/Pagination/Pagination";
import PokemonDetailModal from "../PokemonDetailModal/PokemonDetailModal";
import { useState, useEffect } from "react";
import "./PokemonList.css";
import Loader from "../../common/Loader/Loader";

const { Search } = Input;
const { Text } = Typography;

export default function PokemonList() {
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        pokemons,
        loading,
        error,
        pagination,
        isSearchActive,
        searchQuery,
        loadNextPage,
        loadPreviousPage,
        changeLimit,
        goToPage,
        searchPokemon,
        refreshPokemons,
        clearSearch,
        clearError,
        hasPokemons,
        currentPage,
        totalPages
    } = usePokemon();

    // Sincronizar localSearchQuery con searchQuery del hook
    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    // Cuando se limpia la búsqueda, recargar todos los Pokémon
    useEffect(() => {
        if (!isSearchActive && !searchQuery.trim()) {
            refreshPokemons();
        }
    }, [isSearchActive, searchQuery, refreshPokemons]);

    const handleSearch = (value: string) => {
        searchPokemon(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);

        // Si se borra todo el texto, limpiar la búsqueda y volver a cargar todos los Pokémon
        if (!value.trim()) {
            clearSearch();
            // Forzar la recarga de todos los Pokémon
            setTimeout(() => {
                refreshPokemons();
            }, 100);
        }
    };

    const handlePageChange = (page: number) => {
        goToPage(page - 1);
    };

    const handleLimitChange = (current: number, size: number) => {
        changeLimit(size);
    };

    const handlePokemonClick = (pokemon: any) => {
        setSelectedPokemon(pokemon);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedPokemon(null);
    };

    return (
        <div data-testid="pokemon-list" className="pokemon-list">
            {/* Barra de búsqueda */}
            <div
                data-testid="search-container"
                style={{
                    marginBottom: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Search
                    size="large"
                    allowClear={true}
                    variant="outlined"
                    color="cyan"
                    data-testid="pokemon-search"
                    placeholder="Search Pokemon by name..."
                    onSearch={handleSearch}
                    style={{ maxWidth: 400 }}
                    loading={loading}
                    enterButton={<SearchOutlined />}
                    value={localSearchQuery}
                    onChange={handleInputChange}
                    suffix={localSearchQuery ? <ClearOutlined onClick={() => clearSearch()} /> : null}
                />
            </div>

        

            {/* Manejo de errores */}
            {error && (
                <Alert
                    data-testid="error-alert"
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={clearError}
                    style={{ marginBottom: 16 }}
                />
            )}


            {/* Contenido principal */}
            <div data-testid="pokemon-content">
                {loading ? (
                    <Loader />
                ) : pokemons.length > 0 ? (
                    <>
                        {/* Lista de Pokémon */}
                        <Row
                            data-testid="pokemon-grid"
                            gutter={pokemons.length === 1 ? [0, 0] : [16, 16]}
                            style={{ 
                                marginBottom: '32px', 
                                display: pokemons.length === 1 ? 'block' : 'flex',
                                justifyContent: pokemons.length === 1 ? 'center' : 'flex-start'
                            }}
                        >
                            {pokemons.map((pokemon: any) => (
                                <Col 
                                    xs={24} 
                                    sm={pokemons.length === 1 ? 24 : 12} 
                                    md={pokemons.length === 1 ? 20 : 8} 
                                    lg={pokemons.length === 1 ? 16 : 6} 
                                    xl={pokemons.length === 1 ? 14 : 6}
                                    style={{ 
                                        maxWidth: pokemons.length === 1 ? '600px' : '100%',
                                        margin: pokemons.length === 1 ? '0 auto' : '0'
                                    }}
                                    key={pokemon.id}
                                >
                                    <PokemonCard pokemon={pokemon} onClick={handlePokemonClick} />
                                </Col>
                            ))}
                        </Row>

                        {/* Paginación - solo mostrar si no hay búsqueda activa */}
                        {!isSearchActive && (
                            <Pagination
                                current={currentPage}
                                total={pagination.total}
                                pageSize={pagination.limit}
                                onChange={handlePageChange}
                                onShowSizeChange={handleLimitChange}
                                disabled={loading}
                            />
                        )}
                    </>
                ) : isSearchActive ? (
                    <div
                        data-testid="no-pokemon-state"
                        style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#666'
                        }}
                    >
                        <Text style={{ fontSize: 18, marginBottom: 16, display: 'block' }}>
                            No se encontraron Pokémon con el nombre "{searchQuery}"
                        </Text>
                        <Text style={{ fontSize: 14, marginBottom: 24, display: 'block', color: '#999' }}>
                            Intenta con otro nombre o revisa la ortografía
                        </Text>
                        <Button data-testid="try-again-button" onClick={clearSearch} style={{ marginRight: 8 }}>
                            Limpiar Búsqueda
                        </Button>
                        <Button data-testid="try-again-button" onClick={refreshPokemons}>
                            Ver Todos los Pokémon
                        </Button>
                    </div>
                ) : (
                    <div
                        data-testid="no-pokemon-state"
                        style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#666'
                        }}
                    >
                        <Text style={{ fontSize: 18, marginBottom: 16, display: 'block' }}>
                            No se pudieron cargar los Pokémon
                        </Text>
                        <Button data-testid="try-again-button" onClick={refreshPokemons}>
                            Intentar de Nuevo
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            {selectedPokemon && (
                <PokemonDetailModal
                    pokemon={selectedPokemon}
                    open={isModalOpen}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}