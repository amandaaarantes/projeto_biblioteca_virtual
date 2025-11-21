import React, { useEffect, useState } from 'react';
import { type Loan } from '../../types/Loan';
import { getLoans, deleteLoan } from '../../services/loanService';
import LoanForm from './LoanForm';

const LoanList: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<Loan | undefined>(undefined);
    
    const [filters, setFilters] = useState({
        codigo: '',
        nickname: '',
        livro: '',
        data: ''
    });

    const fetchLoans = async () => {
        const data = await getLoans(filters);
        setLoans(data);
    };

    useEffect(() => { fetchLoans(); }, [filters]);

    const handleDelete = async (loan: Loan) => {
        if (loan.status === 'Atrasado') {
            alert("Não é possível excluir empréstimo Atrasado.");
            return;
        }
        if(confirm("Excluir empréstimo?")) {
            try {
                await deleteLoan(loan.id);
                fetchLoans();
            } catch (e: any) { alert(e.message); }
        }
    };

    const handleAdd = () => {
        setEditItem(undefined); 
        setIsFormOpen(true);
    }
    
    // ESTILOS PADRÃO PARA ALINHAMENTO E BOTÕES
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
    
    // Estilo do botão de ação da tabela (Excluir)
    const deleteButtonStyle: React.CSSProperties = {
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#f8f9fa', 
        border: `1px solid ${defaultBorderColor}`,
        color: defaultBorderColor, 
    };


    return (
        <div className="loan-list">
            <h3>Gerenciamento de Empréstimos</h3>

            {isFormOpen && (
                <LoanForm 
                    loanToEdit={editItem} 
                    onSuccess={() => { setIsFormOpen(false); fetchLoans(); }} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            )}

            {/* --- ÁREA DE FILTROS (Tabela 6 do DRE) --- */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '10px',
                alignItems: 'end'
            }}>
                {/* Filtro 1: Código do Empréstimo */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Cód. Empréstimo" 
                        value={filters.codigo}
                        onChange={(e) => setFilters({...filters, codigo: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 2: Nickname do Usuário */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Nickname" 
                        value={filters.nickname}
                        onChange={(e) => setFilters({...filters, nickname: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 3: Código do Livro */}
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Cód. Livro" 
                        value={filters.livro}
                        onChange={(e) => setFilters({...filters, livro: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* Filtro 4: Data do Empréstimo - APLICAÇÃO DOS ESTILOS */}
                <div>
                    <label style={labelStyle}>Data Empréstimo:</label>
                    <input 
                        type="date"
                        value={filters.data}
                        onChange={(e) => setFilters({...filters, data: e.target.value})} 
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
                    + Novo Empréstimo
                </button>
            </div>

            {/* --- TABELA (Tabela 5 do DRE) --- */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Cód.</th>
                            <th style={{ padding: '10px' }}>Usuário</th>
                            <th style={{ padding: '10px' }}>Livro (Cód)</th>
                            <th style={{ padding: '10px' }}>Data Emp.</th>
                            <th style={{ padding: '10px' }}>Prazo</th>
                            <th style={{ padding: '10px' }}>Devolução Real</th> 
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px', width: '150px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(l => (
                            <tr key={l.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{l.codigoIdentificador}</td>
                                <td style={{ padding: '10px' }}>{l.nicknameUsuario}</td>
                                <td style={{ padding: '10px' }}>{l.codigoLivro}</td>
                                <td style={{ padding: '10px' }}>{l.dataEmprestimo}</td>
                                <td style={{ padding: '10px' }}>{l.dataPrazo}</td>
                                <td style={{ padding: '10px' }}>
                                    {l.dataDevolucaoReal ? l.dataDevolucaoReal : '-'}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85em',
                                        backgroundColor: l.status === 'Em dia' ? '#d4edda' : 
                                                         l.status === 'Devolvido' ? '#cce5ff' : '#f8d7da',
                                        color: l.status === 'Em dia' ? '#155724' : 
                                               l.status === 'Devolvido' ? '#004085' : '#721c24'
                                    }}>
                                        {l.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* CONTÊINER FLEX PARA OS BOTÕES */}
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => { setEditItem(l); setIsFormOpen(true); }} style={{ cursor: 'pointer' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(l)} style={deleteButtonStyle}>
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

export default LoanList;