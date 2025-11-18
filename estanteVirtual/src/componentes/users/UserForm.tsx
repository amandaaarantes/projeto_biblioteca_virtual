import React, { useState } from 'react';
import { type User, type UserProfile } from '../../types/User';
import { createUser, updateUser } from '../../services/userService';

interface UserFormProps {
    userToEdit?: User; 
    onUserSaved: () => void; 
    onCancel: () => void; 
}

const initialUserState: Omit<User, 'id' | 'dataCadastro'> = {
    nome: '',
    nickname: '',
    telefone: '',
    endereco: '',
    email: '',
    senha: '',
    perfil: 'Usuário' as UserProfile, 
};

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onUserSaved, onCancel }) => {
    const [userData, setUserData] = useState<Omit<User, 'id' | 'dataCadastro'>>(
        userToEdit ? {
            nome: userToEdit.nome,
            nickname: userToEdit.nickname,
            telefone: userToEdit.telefone,
            endereco: userToEdit.endereco,
            email: userToEdit.email,
            senha: '', 
            perfil: userToEdit.perfil,
        } : initialUserState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!userToEdit;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'perfil' ? value as UserProfile : value;
        
        setUserData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditing && userToEdit) {
                await updateUser(userToEdit.id, userData); 
                alert(`Usuário ${userData.nickname} editado com sucesso!`);
            } else {
                await createUser(userData, userData.perfil); 
                alert('Usuário cadastrado com sucesso!');
            }
            onUserSaved(); 
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar o usuário.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #007bff', marginBottom: '20px' }}>
            <h4>{isEditing ? `Editar Usuário: ${userToEdit?.nickname}` : 'Cadastro de Novo Usuário'}</h4>
            <form onSubmit={handleSubmit}>
                
                <input name="nome" value={userData.nome} onChange={handleChange} placeholder="Nome do Usuário" required /><br/>
                
                {/* CORREÇÃO: Removido disabled={isEditing} para cumprir o RF3 */}
                <input 
                    name="nickname" 
                    value={userData.nickname} 
                    onChange={handleChange} 
                    placeholder="Apelido/Nickname (Único)" 
                    required 
                /><br/>

                <input name="email" value={userData.email} onChange={handleChange} type="email" placeholder="Email" required /><br/>
                <input name="telefone" value={userData.telefone} onChange={handleChange} placeholder="Telefone (XX)XXXXX-XXXX" required /><br/>
                <input name="endereco" value={userData.endereco} onChange={handleChange} placeholder="Endereço" required /><br/>
                
                <div style={{fontSize: '0.8em', color: 'gray', marginTop: '5px'}}>
                    * Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e especial.
                </div>
                <input 
                    name="senha" 
                    value={userData.senha} 
                    onChange={handleChange} 
                    type="password" 
                    placeholder={isEditing ? "Nova Senha (vazio = manter)" : "Senha Forte"}
                    required={!isEditing}
                /><br/>
                
                <select name="perfil" value={userData.perfil} onChange={handleChange} required>
                    <option value="Usuário">Usuário</option>
                    <option value="Bibliotecário">Bibliotecário</option>
                    <option value="Administrador">Administrador</option>
                </select><br/>
                
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
                
                <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                    {loading ? 'Salvando...' : (isEditing ? 'Salvar Edição' : 'Cadastrar')}
                </button>
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default UserForm;