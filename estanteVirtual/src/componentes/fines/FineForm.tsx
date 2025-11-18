import React, { useState } from 'react';
import { type Fine, type FineStatus } from '../../types/Fine';
import { createFine, updateFine } from '../../services/fineService';

interface Props {
    fineToEdit?: Fine;
    onSuccess: () => void;
    onCancel: () => void;
}

const FineForm: React.FC<Props> = ({ fineToEdit, onSuccess, onCancel }) => {
    const isEditing = !!fineToEdit;
    const [formData, setFormData] = useState<Partial<Fine>>(
        fineToEdit || {
            codigoMulta: '',
            valor: 0,
            status: 'Aguardando pagamento',
            nicknameUsuario: '',
            idEmprestimo: ''
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && fineToEdit) {
                await updateFine(fineToEdit.id, formData);
            } else {
                await createFine(formData as Fine);
            }
            onSuccess();
        } catch (err: any) { alert(err.message); }
    };

    // Estilos para manter o formulário bonito e organizado
    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc', // Borda cinza suave (antes era red)
        borderRadius: '8px',      // Cantos arredondados
        padding: '20px',          // Espaço interno
        marginBottom: '20px',     // Espaço externo inferior
        backgroundColor: '#f9f9f9', // Fundo levemente cinza para destacar
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)' // Sombra leve
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

    return (
        <div style={containerStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                {isEditing ? 'Editar Multa' : 'Nova Multa'}
            </h3>
            
            <form onSubmit={handleSubmit}>
                {/* Linha 1: 3 Campos lado a lado */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Cód. Multa</label>
                        <input 
                            name="codigoMulta" 
                            placeholder="Ex: 500" 
                            value={formData.codigoMulta} 
                            onChange={handleChange} 
                            disabled={isEditing} 
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
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>ID Emp. Origem</label>
                        <input 
                            name="idEmprestimo" 
                            placeholder="Ex: 100" 
                            value={formData.idEmprestimo} 
                            onChange={handleChange} 
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Linha 2: Valor e Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={labelStyle}>Valor (R$):</label>
                        <input 
                            type="number" 
                            name="valor" 
                            value={formData.valor} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Status:</label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            style={{...inputStyle, height: '41px'}} // Ajuste fino de altura
                        >
                            <option value="Aguardando pagamento">Aguardando pagamento</option>
                            <option value="Multa paga">Multa paga</option>
                        </select>
                    </div>
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

export default FineForm;