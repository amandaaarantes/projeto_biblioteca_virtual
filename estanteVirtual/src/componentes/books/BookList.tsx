import React, { useState, useEffect } from 'react';
import { type Book, type BookFilters } from '../../types/Book'; 
import { getBooks, deleteBook } from '../../services/bookService'; 
import BookForm from './BookForm'; 

const BookList: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<BookFilters>({});
    const [error, setError] = useState<string | null>(null);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined); 

    const currentUserProfile = 'Bibliotecário' as const; 

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBooks(filters); 
            setBookList(data);
        } catch (err) {
            setError("Erro ao carregar livros.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setBookToEdit(undefined); 
        setIsFormOpen(true);
    }
    
    const handleEdit = (book: Book) => {
        if (currentUserProfile !== 'Bibliotecário' && currentUserProfile !== 'Administrador') {
            alert("Apenas Bibliotecários e Administradores podem editar livros.");
            return;
        }
        setBookToEdit(book);
        setIsFormOpen(true);
    }

    const handleDelete = async (id: string, titulo: string) => {
        if (currentUserProfile !== 'Administrador') { 
            alert("Apenas Administradores podem excluir livros.");
            return;
        }
        if (window.confirm(`Confirma a exclusão do livro "${titulo}"?`)) { 
            try {
                await deleteBook(id);
                fetchBooks(); 
                alert("Livro excluído com sucesso.");
            } catch (err: any) {
                alert(`Erro ao excluir: ${err.message}`);
            }
        }
    };
    
    useEffect(() => {
        fetchBooks();
    }, [filters.titulo, filters.autor, filters.dataPublicacao, filters.codigoIdentificador]); 
    
    // Estilo do botão de Excluir padronizado
    const defaultBorderColor = '#6c757d'; 
    const deleteButtonStyle: React.CSSProperties = {
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#f8f9fa', 
        border: `1px solid ${defaultBorderColor}`,
        color: defaultBorderColor, 
    };

    return (
        <div className="book-list">
            <h3>Gerenciamento de Acervo</h3>

            {isFormOpen && (
                <BookForm
                    bookToEdit={bookToEdit}
                    onCancel={() => setIsFormOpen(false)} 
                    onBookSaved={() => {
                        setIsFormOpen(false); 
                        fetchBooks(); 
                    }}
                />
            )}
            
            {/* --- ÁREA DE FILTROS (Todos os 4 filtros da Tabela 4) --- */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '10px',
                alignItems: 'end'
            }}>
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Título" 
                        onChange={(e) => setFilters({...filters, titulo: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Código" 
                        onChange={(e) => setFilters({...filters, codigoIdentificador: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        placeholder="Buscar Autor" 
                        onChange={(e) => setFilters({...filters, autor: e.target.value})} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div>
                    <label style={{fontSize: '12px', fontWeight: 'bold'}}></label>
                    <input 
                        type="number"
                        placeholder="Ex: 2024"
                        onChange={(e) => setFilters({
                            ...filters, 
                            dataPublicacao: e.target.value ? parseInt(e.target.value) : undefined
                        })} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button 
                    onClick={handleAdd} 
                    style={{ 
                        padding: '8px 15px', 
                        cursor: 'pointer', 
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        height: '35px'
                    }}
                >
                    + Novo Livro
                </button>
            </div>
            
            {loading && <p>Carregando dados...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            
            {/* --- TABELA (Todos os campos da Tabela 3) --- */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Cód.</th>
                            <th style={{ padding: '10px' }}>Título</th>
                            <th style={{ padding: '10px' }}>Descrição</th> 
                            <th style={{ padding: '10px' }}>Autor</th>
                            <th style={{ padding: '10px' }}>Loc. Física</th>
                            <th style={{ padding: '10px' }}>Ano</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px', width: '150px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookList.map(book => (
                            <tr key={book.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{book.codigoIdentificador}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{book.titulo}</td>
                                <td style={{ padding: '10px', fontSize: '0.9em', color: '#555' }}>
                                    {book.descricao}
                                </td>
                                <td style={{ padding: '10px' }}>{book.autor}</td>
                                <td style={{ padding: '10px' }}>{book.localizacao}</td>
                                <td style={{ padding: '10px' }}>{book.dataPublicacao}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85em',
                                        backgroundColor: book.status === 'Disponível' ? '#d4edda' : '#fff3cd',
                                        color: book.status === 'Disponível' ? '#155724' : '#856404'
                                    }}>
                                        {book.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* CONTÊINER FLEX PARA OS BOTÕES */}
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                            onClick={() => handleEdit(book)} 
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(book.id, book.titulo)} 
                                            style={deleteButtonStyle}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookList;