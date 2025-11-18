import React, { useState, useEffect } from 'react';
import { type User, type UserFilters } from '../../types/User'; 
import { getUsers, deleteUser } from '../../services/userService'; 
import UserForm from './UserForm'; 

const UserList: React.FC = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<UserFilters>({});
    const [error, setError] = useState<string | null>(null);
    
    // NOVO: Controle de estado para o formulário e edição
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined); 

    // MOCK: Perfil para controle de acesso (Apenas Admin pode excluir)
    const currentUserProfile = 'Administrador' as const; // MOCKADO como Admin para testar exclusão

    // Implementação de Consultar Usuário [RF2]
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // [RF2] Consultar Usuário: Usa os filtros da Tabela 2
            const data = await getUsers(filters); 
            setUserList(data);
        } catch (err) {
            setError("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    // Função para abrir o formulário em modo de Cadastro [RF1]
    const handleAdd = () => {
        setUserToEdit(undefined); // Garante que é um novo cadastro
        setIsFormOpen(true);
    }
    
    // Função para abrir o formulário em modo de Edição [RF3]
    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setIsFormOpen(true);
    }

    // Implementação de Excluir Usuário [RF4] - Apenas Administrador
    const handleDelete = async (id: string, nickname: string) => {
        // Atores: Administrador pode excluir [RF4]
        if (currentUserProfile !== 'Administrador') { 
            alert("Apenas Administradores podem excluir usuários.");
            return;
        }
        if (window.confirm(`Confirma a exclusão do usuário "${nickname}"?`)) { 
            try {
                await deleteUser(id);
                fetchUsers(); // Recarrega a lista
                alert("Usuário excluído com sucesso.");
            } catch (err: any) {
                alert(`Erro ao excluir: ${err.message}`);
            }
        }
    };
    
    // Recarrega a lista quando o componente monta ou quando os filtros mudam
    useEffect(() => {
        fetchUsers();
    }, [filters.nome, filters.nickname]); 

    return (
        <div className="user-list">
            <h3>Gerenciamento de Usuários</h3>

            {/* Renderização Condicional do Formulário (Inserir/Editar) */}
            {isFormOpen && (
                <UserForm
                    userToEdit={userToEdit}
                    onCancel={() => setIsFormOpen(false)} // Fecha o formulário
                    onUserSaved={() => {
                        setIsFormOpen(false); // Fecha o formulário após salvar
                        fetchUsers(); // Recarrega a lista para ver a mudança
                    }}
                />
            )}
            
            {/* Filtros [RF2] - Tabela 2 */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    placeholder="Buscar por Nome do Usuário" 
                    onChange={(e) => setFilters({...filters, nome: e.target.value})} 
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <input 
                    placeholder="Buscar por Apelido" 
                    onChange={(e) => setFilters({...filters, nickname: e.target.value})} 
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button 
                    onClick={handleAdd} // Abre o formulário de Cadastro [RF1]
                    style={{ padding: '8px 15px', cursor: 'pointer' }}
                >
                    + Novo Usuário
                </button>
            </div>
            
            {loading && <p>Carregando dados...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Apelido</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map(user => (
                        <tr key={user.id}>
                            <td>{user.nome}</td>
                            <td>{user.nickname}</td>
                            <td>{user.telefone}</td>
                            <td>{user.email}</td>
                            <td>{user.perfil}</td>
                            <td>
                                <button onClick={() => handleEdit(user)} style={{ marginRight: '5px' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(user.id, user.nickname)} style={{ cursor: 'pointer' }}>
                                    Excluir (Admin)
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;