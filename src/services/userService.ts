import { type User, type UserFilters, type UserProfile } from '../types/User'; 
import { v4 as uuidv4 } from 'uuid'; 
import { hasActiveLoan } from './loanService'; 
import { hasPendingFine } from './fineService'; 

let mockUsers: User[] = [
    {
        id: 'u1', nome: 'Admin Master', nickname: 'admin', telefone: '11999998888',
        endereco: 'Rua Principal, 100', email: 'admin@library.com', senha: 'Admin@123',
        perfil: 'Administrador', dataCadastro: new Date().toISOString().split('T')[0]
    },
    {
        id: 'u2', nome: 'Bibliotecário Chefe', nickname: 'biblio', telefone: '21988887777',
        endereco: 'Av. Secundária, 200', email: 'biblio@library.com', senha: 'User@123',
        perfil: 'Bibliotecário', dataCadastro: new Date().toISOString().split('T')[0]
    },
];

const validatePassword = (senha: string) => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!strongRegex.test(senha)) {
        throw new Error("RNF07: A senha deve ter no mínimo 8 caracteres, conter maiúscula, minúscula, número e caractere especial.");
    }
};

export const createUser = async (newUserData: Omit<User, 'id' | 'dataCadastro' | 'perfil'>, perfil: UserProfile): Promise<User> => {
    if (mockUsers.some(u => u.nickname === newUserData.nickname)) {
        throw new Error(`Nickname '${newUserData.nickname}' já está em uso.`);
    }
    validatePassword(newUserData.senha);

    const newUser: User = {
        ...newUserData,
        id: uuidv4(),
        perfil: perfil, 
        dataCadastro: new Date().toISOString().split('T')[0],
    };

    mockUsers.push(newUser);
    return newUser;
};

export const updateUser = async (id: string, updatedData: Omit<User, 'id' | 'dataCadastro'>): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error("Usuário não encontrado.");

    // CORREÇÃO: Validação de unicidade do nickname na edição
    // Verifica se existe algum OUTRO usuário (id diferente) com esse mesmo nickname
    if (mockUsers.some(u => u.nickname === updatedData.nickname && u.id !== id)) {
        throw new Error(`O Nickname '${updatedData.nickname}' já está sendo usado por outro usuário.`);
    }

    if (updatedData.senha && updatedData.senha.length > 0) {
        validatePassword(updatedData.senha);
    } else {
        updatedData.senha = mockUsers[userIndex].senha;
    }
    
    const existingUser = mockUsers[userIndex];
    const updatedUser: User = {
        ...existingUser,
        ...updatedData,
        id: existingUser.id, 
        // nickname agora vem do updatedData, pois pode ter mudado
        nickname: updatedData.nickname,
        dataCadastro: existingUser.dataCadastro,
    };

    mockUsers[userIndex] = updatedUser;
    return updatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error("Usuário não encontrado.");

    if (hasActiveLoan(user.nickname)) {
        throw new Error("[RF4] Não é possível excluir: Usuário possui empréstimos ativos ou atrasados.");
    }

    if (hasPendingFine(user.nickname)) {
        throw new Error("[RF4] Não é possível excluir: Usuário possui multas aguardando pagamento.");
    }

    mockUsers = mockUsers.filter(u => u.id !== id);
};

export const getUsers = async (filters: UserFilters): Promise<User[]> => {
    return mockUsers.filter(user => {
        const matchesName = filters.nome
            ? user.nome.toLowerCase().includes(filters.nome.toLowerCase())
            : true;
        const matchesNickname = filters.nickname
            ? user.nickname.toLowerCase().includes(filters.nickname.toLowerCase())
            : true;
        return matchesName && matchesNickname;
    });
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    return mockUsers.find(u => u.id === id);
};