import React, { useState } from 'react';
import { type Loan, type LoanStatus } from '../../types/Loan';
import { createLoan, updateLoan } from '../../services/loanService';

interface Props {
    loanToEdit?: Loan;
    onSuccess: () => void;
    onCancel: () => void;
}

const LoanForm: React.FC<Props> = ({ loanToEdit, onSuccess, onCancel }) => {
    const isEditing = !!loanToEdit;
    
    const [formData, setFormData] = useState<Partial<Loan>>(
        loanToEdit || {
            codigoIdentificador: '',
            dataEmprestimo: '',
            dataPrazo: '',
            status: 'Em dia',
            nicknameUsuario: '',
            codigoLivro: ''
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && loanToEdit) {
                await updateLoan(loanToEdit.id, formData);
                alert("Empréstimo atualizado!");
            } else {
                await createLoan(formData as Loan);
                alert("Empréstimo registrado!");
            }
            onSuccess();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <h3>{isEditing ? 'Editar Empréstimo' : 'Novo Empréstimo'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input name="codigoIdentificador" placeholder="Cód. Empréstimo" 
                           value={formData.codigoIdentificador} onChange={handleChange} disabled={isEditing} required />
                    
                    <input name="nicknameUsuario" placeholder="Nickname" 
                           value={formData.nicknameUsuario} onChange={handleChange} disabled={isEditing} required />

                    <input name="codigoLivro" placeholder="Cód. Livro" 
                           value={formData.codigoLivro} onChange={handleChange} disabled={isEditing} required />

                    <div>
                        <label>Data Emp.: </label>
                        <input type="date" name="dataEmprestimo" value={formData.dataEmprestimo} onChange={handleChange} disabled={isEditing} required />
                    </div>

                    <div>
                        <label>Prazo: </label>
                        <input type="date" name="dataPrazo" value={formData.dataPrazo} onChange={handleChange} disabled={isEditing} required />
                    </div>

                    <div>
                        <label>Devolução Real: </label>
                        <input type="date" name="dataDevolucaoReal" value={formData.dataDevolucaoReal || ''} onChange={handleChange} />
                    </div>

                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Em dia">Em dia</option>
                        <option value="Atrasado">Atrasado</option>
                        <option value="Devolvido">Devolvido</option>
                    </select>
                </div>
                <br/>
                <button type="submit">Salvar</button>
                <button type="button" onClick={onCancel} style={{marginLeft: '10px'}}>Cancelar</button>
            </form>
        </div>
    );
};
export default LoanForm;