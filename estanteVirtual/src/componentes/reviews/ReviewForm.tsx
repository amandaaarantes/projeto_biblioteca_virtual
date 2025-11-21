import React, { useState } from 'react';
import { type Review } from '../../types/Review';
import { createReview, updateReview } from '../../services/reviewService';

interface Props {
    reviewToEdit?: Review;
    onSuccess: () => void;
    onCancel: () => void;
}

const ReviewForm: React.FC<Props> = ({ reviewToEdit, onSuccess, onCancel }) => {
    const isEditing = !!reviewToEdit;
    // O formulário só aceitará os campos permitidos para edição (RF19)
    const [formData, setFormData] = useState<Partial<Review>>(
        reviewToEdit ? 
        {
            avaliacaoEstrelas: reviewToEdit.avaliacaoEstrelas,
            avaliacaoComentario: reviewToEdit.avaliacaoComentario
        }
        : 
        {
            codigoLivro: '',
            nicknameUsuario: '',
            avaliacaoEstrelas: 0,
            avaliacaoComentario: ''
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseInt(value) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && reviewToEdit) {
                // Ao editar, só passamos os campos que o RF19 permite alterar
                await updateReview(reviewToEdit.id, formData);
            } else {
                // Ao criar, precisamos de todos os campos obrigatórios (RF17)
                await createReview(formData as Omit<Review, 'id' | 'dataAvaliacao'>);
            }
            onSuccess();
        } catch (err: any) { alert(err.message); }
    };

    // Estilos reutilizados de FineForm.tsx
    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc', 
        borderRadius: '8px',      
        padding: '20px',          
        marginBottom: '20px',     
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '0.9em',
        color: '#555'
    };
    
    // Ajuste de altura para o textarea
    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        resize: 'vertical',
        minHeight: '80px'
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                {isEditing ? 'Editar Avaliação' : 'Nova Avaliação'}
            </h3>
            
            <form onSubmit={handleSubmit}>
                
                {/* Campos para Inserção (RF17) - Desabilitados na Edição (RF19) */}
                {!isEditing && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={labelStyle}>Cód. Livro</label>
                            <input 
                                name="codigoLivro" 
                                placeholder="Ex: 100" 
                                value={formData.codigoLivro} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle}
                            />
                        </div>
                        
                        <div>
                            <label style={labelStyle}>Nickname Usuário</label>
                            <input 
                                name="nicknameUsuario" 
                                placeholder="Ex: admin" 
                                value={formData.nicknameUsuario} 
                                onChange={handleChange} 
                                required 
                                style={inputStyle}
                            />
                        </div>
                    </div>
                )}


                {/* Linha: Estrelas (Editável) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Avaliação em Estrelas (0-5):</label>
                        <input 
                            type="number" 
                            name="avaliacaoEstrelas" 
                            value={formData.avaliacaoEstrelas} 
                            onChange={handleChange} 
                            min="0"
                            max="5"
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Linha: Comentário (Editável) */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Comentário:</label>
                    <textarea 
                        name="avaliacaoComentario" 
                        placeholder="Escreva sua avaliação aqui..." 
                        value={formData.avaliacaoComentario} 
                        onChange={handleChange} 
                        style={textareaStyle}
                    />
                </div>
                
                {/* Botões */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit" 
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Salvar
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;