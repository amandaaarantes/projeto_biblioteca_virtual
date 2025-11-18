export type FineStatus = 'Aguardando pagamento' | 'Multa paga';

export interface Fine {
    id: string;
    codigoMulta: string;
    dataInicio: string;
    status: FineStatus;
    valor: number;
    dataPagamento?: string;
    idEmprestimo: string; 
    nicknameUsuario: string; 
}