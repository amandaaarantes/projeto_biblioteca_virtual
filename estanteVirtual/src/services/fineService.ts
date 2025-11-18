import { type Fine, type FineStatus } from '../types/Fine';
import { v4 as uuidv4 } from 'uuid';

let mockFines: Fine[] = [
    {
        id: 'f1', codigoMulta: '500', dataInicio: '2025-10-09', status: 'Aguardando pagamento',
        valor: 15, idEmprestimo: '100', nicknameUsuario: 'admin'
    }
];

// [RF4] Validação auxiliar
export const hasPendingFine = (nickname: string): boolean => {
    return mockFines.some(fine => 
        fine.nicknameUsuario === nickname && fine.status === 'Aguardando pagamento'
    );
};

// [RF13] Inserir Multa
export const createFine = async (data: Omit<Fine, 'id' | 'dataInicio'>): Promise<Fine> => {
    const dataInicioAuto = new Date().toISOString().split('T')[0];
    
    const newFine: Fine = {
        ...data,
        id: uuidv4(),
        dataInicio: dataInicioAuto
    };
    mockFines.push(newFine);
    return newFine;
};

// [RF14] Consultar Multa - Filtros Atualizados
export const getFines = async (filters?: { id?: string, status?: string, idEmprestimo?: string }): Promise<Fine[]> => {
    if (!filters) return mockFines;
    return mockFines.filter(f => {
        const matchId = filters.id 
            ? f.codigoMulta.includes(filters.id) 
            : true;
        
        const matchStatus = filters.status && filters.status !== ''
            ? f.status === filters.status 
            : true;
            
        const matchLoan = filters.idEmprestimo 
            ? f.idEmprestimo.includes(filters.idEmprestimo) 
            : true;

        return matchId && matchStatus && matchLoan;
    });
};

// [RF15] Editar Multa
export const updateFine = async (id: string, data: Partial<Fine>): Promise<Fine> => {
    const index = mockFines.findIndex(f => f.id === id);
    if (index === -1) throw new Error("Multa não encontrada");
    
    mockFines[index] = { ...mockFines[index], ...data };
    return mockFines[index];
};

// [RF16] Excluir Multa
export const deleteFine = async (id: string, razao: string, autorExclusao: string): Promise<void> => {
    if (!razao || !autorExclusao) {
        throw new Error("[RF16] Para excluir multa, é necessário informar a razão e quem excluiu.");
    }
    console.log(`LOG: Multa ${id} excluída por ${autorExclusao}. Razão: ${razao}`);
    mockFines = mockFines.filter(f => f.id !== id);
};