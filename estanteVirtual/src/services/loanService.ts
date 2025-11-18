import { type Loan, type LoanStatus } from '../types/Loan';
import { v4 as uuidv4 } from 'uuid';

// Mock inicial de dados
let mockLoans: Loan[] = [
    {
        id: 'l1', codigoIdentificador: '100', dataEmprestimo: '2025-10-01', dataPrazo: '2025-10-08',
        status: 'Atrasado', nicknameUsuario: 'admin', codigoLivro: '1001'
    },
    {
        id: 'l2', codigoIdentificador: '101', dataEmprestimo: '2025-11-01', dataPrazo: '2025-11-08',
        status: 'Em dia', nicknameUsuario: 'biblio', codigoLivro: '1002'
    }
];

// [RF4] Validação para excluir usuário
export const hasActiveLoan = (nickname: string): boolean => {
    return mockLoans.some(loan => 
        loan.nicknameUsuario === nickname && 
        (loan.status === 'Em dia' || loan.status === 'Atrasado')
    );
};

// [RF8] Validação para excluir livro
export const isBookBorrowed = (codigoLivro: string): boolean => {
    return mockLoans.some(loan => loan.codigoLivro === codigoLivro);
};

// [RF9] Inserir Empréstimo
export const createLoan = async (newLoanData: Omit<Loan, 'id'>): Promise<Loan> => {
    const newLoan: Loan = {
        ...newLoanData,
        id: uuidv4()
    };
    mockLoans.push(newLoan);
    return newLoan;
};

// [RF10] Consultar (Filtros Tabela 6)
export const getLoans = async (filters?: { codigo?: string, data?: string, nickname?: string, livro?: string }): Promise<Loan[]> => {
    if (!filters) return mockLoans;
    return mockLoans.filter(loan => {
        const matchCode = filters.codigo ? loan.codigoIdentificador.includes(filters.codigo) : true;
        const matchData = filters.data ? loan.dataEmprestimo === filters.data : true;
        const matchNick = filters.nickname ? loan.nicknameUsuario.toLowerCase().includes(filters.nickname.toLowerCase()) : true;
        const matchLivro = filters.livro ? loan.codigoLivro === filters.livro : true;
        return matchCode && matchData && matchNick && matchLivro;
    });
};

// [RF11] Editar Empréstimo
export const updateLoan = async (id: string, updatedData: Partial<Loan>): Promise<Loan> => {
    const index = mockLoans.findIndex(l => l.id === id);
    if (index === -1) throw new Error("Empréstimo não encontrado");

    const existing = mockLoans[index];
    const updated: Loan = { ...existing, ...updatedData };
    
    mockLoans[index] = updated;
    return updated;
};

// [RF12] Excluir Empréstimo
export const deleteLoan = async (id: string): Promise<void> => {
    const loan = mockLoans.find(l => l.id === id);
    if (!loan) throw new Error("Empréstimo não encontrado");

    if (loan.status === 'Atrasado') {
        throw new Error("[RF12] Não é possível excluir um empréstimo com status 'Atrasado'.");
    }

    mockLoans = mockLoans.filter(l => l.id !== id);
};