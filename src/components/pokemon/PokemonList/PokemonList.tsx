import { Row, Col, Spin, Alert, Button, Typography, Input, Tag } from "antd";
import { ReloadOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { usePokemon } from "../../../hooks/usePokemon";
import PokemonCard from "../PokemonCard/PokemonCard";
import Pagination from "../../common/Pagination/Pagination";
import PokemonDetailModal from "../PokemonDetailModal/PokemonDetailModal";
import { useState, useEffect } from "react";
import "./PokemonList.css";

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

    const handleSearch = (value: string) => {
        searchPokemon(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);

        // Si se borra todo el texto, limpiar la búsqueda
        if (!value.trim()) {
            clearSearch();
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
                    <div
                        data-testid="loading-state"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px 20px',
                            textAlign: 'center'
                        }}
                    >

                    </div>
                ) : hasPokemons ? (
                    <>
                        {/* Lista de Pokémon */}
                        <Row
                            data-testid="pokemon-grid"
                            gutter={[16, 16]}
                            style={{ marginBottom: '32px' }}
                        >
                            {pokemons.map((pokemon: any) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={pokemon.id}>
                                    <PokemonCard pokemon={pokemon} onClick={handlePokemonClick} />
                                </Col>
                            ))}
                        </Row>

                        {/* Paginación */}
                        <Pagination
                            current={currentPage}
                            total={pagination.total}
                            pageSize={pagination.limit}
                            onChange={handlePageChange}
                            onShowSizeChange={handleLimitChange}
                            disabled={loading}
                        />
                    </>
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
                            No Pokemon found.
                        </Text>
                        <Button data-testid="try-again-button" onClick={refreshPokemons}>
                            Try Again
                        </Button>
                    </div>
                )}
            </div>

            {/* Botón de refresh */}
            <div
                data-testid="refresh-container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '24px',
                    padding: '20px 0'
                }}
            >
                <Button
                    data-testid="refresh-button"
                    icon={<ReloadOutlined />}
                    onClick={refreshPokemons}
                    loading={loading}
                    type="primary"
                >
                    Refresh Pokemon List
                </Button>
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