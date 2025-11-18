export type LoanStatus = 'Em dia' | 'Atrasado' | 'Devolvido';

export interface Loan {
    id: string;
    codigoIdentificador: string; 
    dataEmprestimo: string; 
    dataPrazo: string;      
    dataDevolucaoReal?: string; 
    status: LoanStatus;
    nicknameUsuario: string;
    codigoLivro: string; 
}