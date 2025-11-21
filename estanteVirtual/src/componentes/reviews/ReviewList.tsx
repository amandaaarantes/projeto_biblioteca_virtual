import React, { useEffect, useState } from 'react';
import { type Review } from '../../types/Review';
import { getReviews, deleteReview } from '../../services/reviewService';
import ReviewForm from './ReviewForm';

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<Review | undefined>(undefined);
    
    // Simulação do usuário logado para a Regra de Negócio (RF20)
    const [currentUserNickname] = useState('admin'); 

    // Filtros baseados na Tabela 10 do DRE - ATUALIZADO
    const [filters, setFilters] = useState({
        codigoLivro: '',
        nicknameUsuario: '',
        dataAvaliacao: '' 
    });

    const fetchReviews = async () => {
        const data = await getReviews({
            codigoLivro: filters.codigoLivro,
            nicknameUsuario: filters.nicknameUsuario,
            dataAvaliacao: filters.dataAvaliacao
        });
        setReviews(data);
    };

    useEffect(() => { fetchReviews(); }, [filters]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;

        try {
            await deleteReview(id, currentUserNickname); 
            fetchReviews();
        } catch (e: any) { alert(e.message); }
    };

    const handleAdd = () => {
        setEditItem(undefined); 
        setIsFormOpen(true);
    }

    // Cor da borda/texto para o estilo padrão de botão 
    const defaultBorderColor = '#6c757d'; 

    const labelStyle: React.CSSProperties = {
        fontSize: '12px', 
        fontWeight: 'bold',
        display: 'block', 
        marginBottom: '4px' 
    };
    
    const inputStyle: React.CSSProperties = {
        width: '100%', 
        padding: '8px', 
        height: '35px', 
        boxSizing: 'border-box' 
    };

    return (
        <div className="review-list">
            <h3>Gerenciamento de Avaliações</h3>

            {isFormOpen && (
                <ReviewForm 
                    reviewToEdit={editItem} 
                    onSuccess={() => { setIsFormOpen(false); fetchReviews(); }} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            )}

            {/* --- ÁREA DE FILTROS (Tabela 10 do DRE) --- */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '10px',
                alignItems: 'end'
            }}>
                {/* Filtro 1: Código identificador do livro (busca parcial) */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Cód. Livro" 
                        value={filters.codigoLivro}
                        onChange={(e) => setFilters({...filters, codigoLivro: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 2: Nickname do usuário responsável (busca parcial) */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Nickname" 
                        value={filters.nicknameUsuario}
                        onChange={(e) => setFilters({...filters, nicknameUsuario: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 3: Data da avaliação (Novo filtro) */}
                <div>
                    <label style={labelStyle}>Data da avaliação:</label>
                    <input 
                        type="date"
                        value={filters.dataAvaliacao}
                        onChange={(e) => setFilters({...filters, dataAvaliacao: e.target.value})} 
                        style={inputStyle}
                    />
                </div>

                <button 
                    onClick={handleAdd} 
                    style={{ 
                        padding: '8px 15px', 
                        cursor: 'pointer', 
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        height: '35px'
                    }}
                >
                    + Nova Avaliação
                </button>
            </div>

            {/* --- TABELA (Dados do RF18) --- */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Cód. Livro</th>
                            <th style={{ padding: '10px' }}>Nickname</th>
                            <th style={{ padding: '10px' }}>Estrelas</th>
                            <th style={{ padding: '10px' }}>Comentário</th>
                            <th style={{ padding: '10px' }}>Data</th> 
                            <th style={{ padding: '10px', width: '150px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{r.codigoLivro}</td>
                                <td style={{ padding: '10px' }}>{r.nicknameUsuario}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{'⭐'.repeat(r.avaliacaoEstrelas)} ({r.avaliacaoEstrelas}/5)</td>
                                <td style={{ padding: '10px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.avaliacaoComentario}>
                                    {r.avaliacaoComentario}
                                </td>
                                <td style={{ padding: '10px' }}>{r.dataAvaliacao}</td>
                                <td style={{ padding: '10px' }}>
                                    {/* CONTÊINER FLEX PARA OS BOTÕES */}
                                    <div style={{ display: 'flex', gap: '5px' }}> {/* Adiciona um pequeno gap entre os botões */}
                                        <button 
                                            onClick={() => { setEditItem(r); setIsFormOpen(true); }} 
                                            // Mantém o estilo padrão do botão de edição
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        {/* Botão de Excluir (Estilo padrão com borda e correção da cor do texto) */}
                                        <button 
                                            onClick={() => handleDelete(r.id)} 
                                            style={{ 
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                backgroundColor: '#f8f9fa', 
                                                border: `1px solid ${defaultBorderColor}`,
                                                color: defaultBorderColor, 
                                            }}
                                            disabled={r.nicknameUsuario !== currentUserNickname && currentUserNickname !== 'admin'}
                                            title={r.nicknameUsuario !== currentUserNickname && currentUserNickname !== 'admin' ? "Você só pode excluir suas próprias avaliações." : "Excluir avaliação"}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ReviewList;