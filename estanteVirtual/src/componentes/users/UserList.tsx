import React, { useState, useEffect } from 'react';
import { type User, type UserFilters } from '../../types/User'; 
import { getUsers, deleteUser } from '../../services/userService'; 
import UserForm from './UserForm'; 

const UserList: React.FC = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<UserFilters>({});
    const [error, setError] = useState<string | null>(null);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined); 

    const currentUserProfile = 'Administrador' as const; 

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers(filters); 
            setUserList(data);
        } catch (err) {
            setError("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setUserToEdit(undefined); 
        setIsFormOpen(true);
    }
    
    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setIsFormOpen(true);
    }

    const handleDelete = async (id: string, nickname: string) => {
        if (currentUserProfile !== 'Administrador') { 
            alert("Apenas Administradores podem excluir usuários.");
            return;
        }
        if (window.confirm(`Confirma a exclusão do usuário "${nickname}"?`)) { 
            try {
                await deleteUser(id);
                fetchUsers(); 
                alert("Usuário excluído com sucesso.");
            } catch (err: any) {
                alert(`Erro ao excluir: ${err.message}`);
            }
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, [filters.nome, filters.nickname]); 

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
        <div className="user-list">
            <h3>Gerenciamento de Usuários</h3>

            {isFormOpen && (
                <UserForm
                    userToEdit={userToEdit}
                    onCancel={() => setIsFormOpen(false)} 
                    onUserSaved={() => {
                        setIsFormOpen(false); 
                        fetchUsers(); 
                    }}
                />
            )}
            
            {/* --- ÁREA DE FILTROS --- */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '10px',
                alignItems: 'end'
            }}>
                <input 
                    placeholder="Buscar por Nome do Usuário" 
                    onChange={(e) => setFilters({...filters, nome: e.target.value})} 
                    style={{ width: '100%', padding: '8px' }}
                />
                
                <input 
                    placeholder="Buscar por Apelido" 
                    onChange={(e) => setFilters({...filters, nickname: e.target.value})} 
                    style={{ width: '100%', padding: '8px' }}
                />
                
                <div></div>
                <div></div>

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
                    + Novo Usuário
                </button>
            </div>
            
            {loading && <p>Carregando dados...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            
            {/* Tabela com os ESTILOS INLINE do BookList.tsx */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Cód.</th> 
                            <th style={{ padding: '10px' }}>Nome</th>
                            <th style={{ padding: '10px' }}>Apelido</th>
                            <th style={{ padding: '10px' }}>Telefone</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Perfil</th>
                            <th style={{ padding: '10px', width: '150px' }}>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{user.id.substring(0, 4)}</td> 
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.nome}</td> 
                                <td style={{ padding: '10px' }}>{user.nickname}</td>
                                <td style={{ padding: '10px' }}>{user.telefone}</td>
                                <td style={{ padding: '10px' }}>{user.email}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85em',
                                        backgroundColor: user.perfil === 'Administrador' ? '#d4edda' : '#fff3cd',
                                        color: user.perfil === 'Administrador' ? '#155724' : '#856404'
                                    }}>
                                        {user.perfil}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* CONTÊINER FLEX PARA OS BOTÕES */}
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                            onClick={() => handleEdit(user)} 
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id, user.nickname)} 
                                            style={deleteButtonStyle}
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

export default UserList;