import { type Book, type BookFilters } from '../types/Book'; 
import { v4 as uuidv4 } from 'uuid';
import { isBookBorrowed } from './loanService';

let mockBooks: Book[] = [
    {
        id: 'b1', codigoIdentificador: '1001', titulo: 'Dom Casmurro', descricao: 'Clássico.', autor: 'Machado de Assis',
        localizacao: 'A1-EST2', dataPublicacao: 1899, status: 'Disponível',
        dataCadastro: new Date().toISOString().split('T')[0]
    },
    {
        id: 'b2', codigoIdentificador: '1002', titulo: '1984', descricao: 'Distopia.', autor: 'George Orwell',
        localizacao: 'B3-EST1', dataPublicacao: 1949, status: 'Emprestado',
        dataCadastro: new Date().toISOString().split('T')[0]
    },
];

const validateUniqueCode = (codigo: string, currentId?: string) => {
    if (mockBooks.some(b => b.codigoIdentificador === codigo && b.id !== currentId)) {
        throw new Error(`RNF10: Código Identificador '${codigo}' já está em uso.`);
    }
};

export const createBook = async (newBookData: Omit<Book, 'id' | 'dataCadastro'>): Promise<Book> => {
    validateUniqueCode(newBookData.codigoIdentificador);

    const newBook: Book = {
        ...newBookData,
        id: uuidv4(),
        dataCadastro: new Date().toISOString().split('T')[0],
    };

    mockBooks.push(newBook);
    return newBook;
};

export const updateBook = async (id: string, updatedData: Omit<Book, 'id' | 'dataCadastro'>): Promise<Book> => {
    const bookIndex = mockBooks.findIndex(b => b.id === id);
    if (bookIndex === -1) {
        throw new Error("Livro não encontrado.");
    }

    validateUniqueCode(updatedData.codigoIdentificador, id);
    
    const existingBook = mockBooks[bookIndex];
    const updatedBook: Book = {
        ...existingBook,
        ...updatedData,
        codigoIdentificador: existingBook.codigoIdentificador, 
        id: existingBook.id,
        dataCadastro: existingBook.dataCadastro,
    };

    mockBooks[bookIndex] = updatedBook;
    return updatedBook;
};

export const deleteBook = async (id: string): Promise<void> => {
    const book = mockBooks.find(b => b.id === id);
    if (!book) throw new Error("Livro não encontrado.");

    if (isBookBorrowed(book.codigoIdentificador)) {
        throw new Error("[RF8] Não é possível excluir: Livro possui empréstimos ou multas vinculados.");
    }

    mockBooks = mockBooks.filter(b => b.id !== id);
};

export const getBooks = async (filters: BookFilters): Promise<Book[]> => {
    return mockBooks.filter(book => {
        const matchesTitle = filters.titulo
            ? book.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
            : true;

        const matchesAuthor = filters.autor
            ? book.autor.toLowerCase().includes(filters.autor.toLowerCase())
            : true;
        
        const matchesData = filters.dataPublicacao
            ? book.dataPublicacao === filters.dataPublicacao
            : true;

        const matchesCodigo = filters.codigoIdentificador
             ? book.codigoIdentificador.includes(filters.codigoIdentificador)
             : true;

        return matchesTitle && matchesAuthor && matchesData && matchesCodigo;
    }).sort((a, b) => a.titulo.localeCompare(b.titulo)); 
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
    return mockBooks.find(b => b.id === id);
};