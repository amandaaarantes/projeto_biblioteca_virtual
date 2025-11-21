import { type Review } from '../types/Review';
import { v4 as uuidv4 } from 'uuid';

// Simulação de banco de dados
let mockReviews: Review[] = [
    {
        id: 'rev1', 
        nicknameUsuario: 'admin', 
        codigoLivro: '1001', 
        avaliacaoEstrelas: 5,
        avaliacaoComentario: 'Livro excelente! Recomendo a leitura.',
        dataAvaliacao: '2025-10-15'
    },
    {
        id: 'rev2', 
        nicknameUsuario: 'biblio', 
        codigoLivro: '1002', 
        avaliacaoEstrelas: 3,
        avaliacaoComentario: 'Bom, mas o final deixou a desejar.',
        dataAvaliacao: '2025-11-01'
    }
];

// [RF17] Inserir Avaliações
export const createReview = async (data: Omit<Review, 'id' | 'dataAvaliacao'>): Promise<Review> => {
    // Validação de estrela (0 a 5)
    if (data.avaliacaoEstrelas < 0 || data.avaliacaoEstrelas > 5) {
        throw new Error("A avaliação em estrelas deve ser um valor de 0 a 5.");
    }

    const dataAuto = new Date().toISOString().split('T')[0];
    
    const newReview: Review = {
        ...data,
        id: uuidv4(),
        dataAvaliacao: dataAuto
    };
    mockReviews.push(newReview);
    return newReview;
};

// [RF18] Consultar Avaliações - Filtros (Tabela 10) - MODIFICADO
export const getReviews = async (filters?: { codigoLivro?: string, nicknameUsuario?: string, dataAvaliacao?: string }): Promise<Review[]> => {
    if (!filters) return mockReviews;
    
    // Converte a string de data de avaliação (YYYY-MM-DD) para busca parcial (como feito em LoanList.tsx)
    const filterDate = filters.dataAvaliacao ? filters.dataAvaliacao.trim() : null;

    return mockReviews.filter(r => {
        // Filtro 1: Código identificador do livro (busca parcial)
        const matchBook = filters.codigoLivro 
            ? r.codigoLivro.includes(filters.codigoLivro) 
            : true;
        
        // Filtro 2: Nickname do usuário responsável (busca parcial)
        const matchNickname = filters.nicknameUsuario 
            ? r.nicknameUsuario.includes(filters.nicknameUsuario) 
            : true;
            
        // Filtro 3: Data da avaliação (busca parcial)
        const matchDate = filterDate
            // Verifica se a data de avaliação da review inclui o texto filtrado
            ? r.dataAvaliacao.includes(filterDate) 
            : true;

        return matchBook && matchNickname && matchDate;
    });
};

// [RF19] Editar Avaliações
export const updateReview = async (id: string, data: Partial<Review>): Promise<Review> => {
    const index = mockReviews.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Avaliação não encontrada");

    // [RF19] Somente os campos "Avaliação em estrelas" e "Avaliação em comentário" podem ser alterados.
    const allowedUpdates: Partial<Review> = {};
    if (data.avaliacaoEstrelas !== undefined) {
        if (data.avaliacaoEstrelas < 0 || data.avaliacaoEstrelas > 5) {
            throw new Error("A avaliação em estrelas deve ser um valor de 0 a 5.");
        }
        allowedUpdates.avaliacaoEstrelas = data.avaliacaoEstrelas;
    }
    if (data.avaliacaoComentario !== undefined) {
        allowedUpdates.avaliacaoComentario = data.avaliacaoComentario;
    }
    
    mockReviews[index] = { ...mockReviews[index], ...allowedUpdates };
    return mockReviews[index];
};

// [RF20] Excluir Avaliações
// Para simular a regra de negócio, precisamos saber quem está excluindo (currentUserNickname).
export const deleteReview = async (id: string, currentUserNickname: string): Promise<void> => {
    const reviewToDelete = mockReviews.find(r => r.id === id);
    if (!reviewToDelete) {
        throw new Error("Avaliação não encontrada");
    }

    // Regra de Negócio: Usuários só podem excluir suas próprias avaliações.
    // Administrador e Bibliotecário também podem excluir (atores do RF20), mas vamos focar na regra.
    // Em um sistema real, haveria verificação de perfil, mas aqui focamos no RF.
    if (reviewToDelete.nicknameUsuario !== currentUserNickname) {
         // Simulação: Se o usuário logado não for o autor E não for admin/bibliotecário
        // Usamos 'admin' para simular um perfil com permissão extra.
        if (currentUserNickname !== 'admin' && currentUserNickname !== 'bibliotecario') {
            throw new Error("[RF20] Você só pode excluir suas próprias avaliações.");
        }
    }

    mockReviews = mockReviews.filter(r => r.id !== id);
    console.log(`LOG: Avaliação ${id} excluída por ${currentUserNickname}.`);
};