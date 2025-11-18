import React, { useState } from 'react';
import { type Book, type BookStatus } from '../../types/Book';
import { createBook, updateBook } from '../../services/bookService';

interface BookFormProps {
    bookToEdit?: Book;
    onBookSaved: () => void;
    onCancel: () => void;
}

const initialBookState: Omit<Book, 'id' | 'dataCadastro' | 'status'> & { status: BookStatus } = {
    codigoIdentificador: '',
    titulo: '',
    autor: '',
    descricao: '',    
    localizacao: '',  
    dataPublicacao: new Date().getFullYear(),
    status: 'Disponível', 
};

const BookForm: React.FC<BookFormProps> = ({ bookToEdit, onBookSaved, onCancel }) => {
    
    const [bookData, setBookData] = useState(
        bookToEdit ? {
            codigoIdentificador: bookToEdit.codigoIdentificador,
            titulo: bookToEdit.titulo,
            autor: bookToEdit.autor,
            descricao: bookToEdit.descricao,
            localizacao: bookToEdit.localizacao,
            dataPublicacao: bookToEdit.dataPublicacao,
            status: bookToEdit.status,
        } : initialBookState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!bookToEdit;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = (type === 'number' || name === 'dataPublicacao') ? parseInt(value) || 0 : value;

        if (name === 'status') {
            setBookData(prev => ({ ...prev, [name]: value as BookStatus }));
        } else {
            setBookData(prev => ({ ...prev, [name]: finalValue }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditing && bookToEdit) {
                await updateBook(bookToEdit.id, bookData); 
                alert(`Livro "${bookData.titulo}" editado com sucesso!`);
            } else {
                await createBook(bookData); 
                alert('Livro cadastrado com sucesso!');
            }
            onBookSaved(); 
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar o livro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #007bff', marginBottom: '20px' }}>
            <h4>{isEditing ? `Editar Livro: ${bookToEdit?.titulo}` : 'Cadastro de Novo Livro'}</h4>
            <form onSubmit={handleSubmit}>
                
                <input 
                    name="codigoIdentificador" 
                    value={bookData.codigoIdentificador} 
                    onChange={handleChange} 
                    placeholder="Código Identificador" 
                    required 
                    disabled={isEditing} 
                /><br/>
                <input name="titulo" value={bookData.titulo} onChange={handleChange} placeholder="Título" required /><br/>
                <input name="autor" value={bookData.autor} onChange={handleChange} placeholder="Autor" required /><br/>
                
                <textarea 
                    name="descricao" 
                    value={bookData.descricao} 
                    onChange={handleChange} 
                    placeholder="Descrição / Sinopse" 
                    rows={3}
                    style={{ width: '100%', marginBottom: '8px' }}
                    required 
                /><br/>
                
                <input name="localizacao" value={bookData.localizacao} onChange={handleChange} placeholder="Localização Física (Ex: A1-01)" required /><br/>
                
                <input 
                    name="dataPublicacao" 
                    value={bookData.dataPublicacao} 
                    onChange={handleChange} 
                    type="number" 
                    placeholder="Data de Publicação" 
                    required 
                /><br/>
                
                <label>Status: </label>
                <select name="status" value={bookData.status} onChange={handleChange} required>
                    <option value="Disponível">Disponível</option>
                    <option value="Emprestado">Emprestado</option>
                    {/* Opção Reservado REMOVIDA */}
                </select><br/><br/>
                
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

export default BookForm;