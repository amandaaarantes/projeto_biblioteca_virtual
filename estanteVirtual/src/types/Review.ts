export interface Review {
    id: string; // ID interno, não requisitado mas padrão para entidades
    nicknameUsuario: string; // *Nickname do usuário responsável (Tabela 9)
    codigoLivro: string; // *Código identificador do livro (Tabela 9)
    avaliacaoEstrelas: number; // *Avaliação em estrelas (0 a 5) (Tabela 9)
    avaliacaoComentario: string; // Avaliação em comentário (Tabela 9)
    dataAvaliacao: string; // Adicionado para fins de filtragem e registro
}