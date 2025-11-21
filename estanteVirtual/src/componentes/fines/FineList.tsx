import React, { useEffect, useState } from 'react';
import { type Fine, type FineStatus } from '../../types/Fine';
import { getFines, deleteFine } from '../../services/fineService';
import FineForm from './FineForm';

const FineList: React.FC = () => {
    const [fines, setFines] = useState<Fine[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<Fine | undefined>(undefined);

    // Filtros baseados na Tabela 8 do DRE
    const [filters, setFilters] = useState({
        id: '',
        idEmprestimo: '',
        status: ''
    });

    const fetchFines = async () => {
        const data = await getFines(filters);
        setFines(data);
    };

    useEffect(() => { fetchFines(); }, [filters]);

    const handleDelete = async (id: string) => {
        // [RF16] Exige razão e quem excluiu
        const razao = prompt("Qual a razão da exclusão?");
        if (!razao) return;
        
        const autor = "AdminLogado"; 
        
        try {
            await deleteFine(id, razao, autor);
            fetchFines();
        } catch (e: any) { alert(e.message); }
    };

    const handleAdd = () => {
        setEditItem(undefined); 
        setIsFormOpen(true);
    }

    // Estilo do botão de Excluir padronizado
    const defaultBorderColor = '#6c757d'; 
    const deleteButtonStyle: React.CSSProperties = {
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#f8f9fa', 
        border: `1px solid ${defaultBorderColor}`,
        color: defaultBorderColor, 
    };

    return (
        <div className="fine-list">
            <h3>Gerenciamento de Multas</h3>

            {isFormOpen && (
                <FineForm 
                    fineToEdit={editItem} 
                    onSuccess={() => { setIsFormOpen(false); fetchFines(); }} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            )}

            {/* --- ÁREA DE FILTROS (Tabela 8 do DRE) --- */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '10px',
                alignItems: 'end'
            }}>
                {/* Filtro 1: Código da Multa */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Cód. Multa" 
                        value={filters.id}
                        onChange={(e) => setFilters({...filters, id: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 2: Código do Empréstimo */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Cód. Emp." 
                        value={filters.idEmprestimo}
                        onChange={(e) => setFilters({...filters, idEmprestimo: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 3: Status */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}>Status: </label>
                    <select 
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})} 
                        style={{ width: '100%', padding: '8px', height: '35px' }}
                    >
                        <option value="">Todos</option>
                        <option value="Aguardando pagamento">Aguardando pagamento</option>
                        <option value="Multa paga">Multa paga</option>
                    </select>
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
                    + Nova Multa
                </button>
            </div>

            {/* --- TABELA (Tabela 7 do DRE) --- */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Cód. Multa</th>
                            <th style={{ padding: '10px' }}>Cód. Emp.</th>
                            <th style={{ padding: '10px' }}>Nickname</th>
                            <th style={{ padding: '10px' }}>Valor</th>
                            <th style={{ padding: '10px' }}>Data Início</th> 
                            <th style={{ padding: '10px' }}>Data Pagamento</th> 
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px', width: '150px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fines.map(f => (
                            <tr key={f.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{f.codigoMulta}</td>
                                <td style={{ padding: '10px' }}>{f.idEmprestimo}</td>
                                <td style={{ padding: '10px' }}>{f.nicknameUsuario}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>R$ {f.valor}</td>
                                <td style={{ padding: '10px' }}>{f.dataInicio}</td>
                                <td style={{ padding: '10px' }}>{f.dataPagamento || '-'}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85em',
                                        backgroundColor: f.status === 'Multa paga' ? '#d4edda' : '#fff3cd',
                                        color: f.status === 'Multa paga' ? '#155724' : '#856404'
                                    }}>
                                        {f.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* CONTÊINER FLEX PARA OS BOTÕES */}
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => { setEditItem(f); setIsFormOpen(true); }} style={{ cursor: 'pointer' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(f.id)} style={deleteButtonStyle}>
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
export default FineList;