// CORREÇÃO: Status restrito a Disponível ou Emprestado
export type BookStatus = 'Disponível' | 'Emprestado';

export interface Book {
    id: string; 
    codigoIdentificador: string; 
    titulo: string;
    descricao: string;       
    autor: string;
    localizacao: string;     
    dataPublicacao: number;
    status: BookStatus;
    dataCadastro: string; 
}

export interface BookFilters {
    titulo?: string;
    autor?: string;
    dataPublicacao?: number; 
    codigoIdentificador?: string; 
}