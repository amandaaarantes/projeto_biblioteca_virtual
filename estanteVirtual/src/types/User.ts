export type UserProfile = 'Administrador' | 'Bibliotecário' | 'Usuário';

export interface User {
    id: string; 
    nome: string;
    nickname: string; // [RF1] Deve ser único
    telefone: string;
    endereco: string;
    email: string;
    senha: string; // [RNF07] Deve ser forte
    perfil: UserProfile;
    dataCadastro: string;
}

export interface UserFilters {
    nome?: string;
    nickname?: string;
}