import React from 'react';

interface LayoutProps {
  // O conteúdo principal da tela
  children: React.ReactNode; 
  // Atualizado para aceitar 'loans', 'fines' e 'reviews'
  onNavigate: (screen: 'users' | 'books' | 'loans' | 'fines' | 'reviews') => void; 
  // Atualizado para aceitar 'loans', 'fines' e 'reviews'
  currentScreen: 'users' | 'books' | 'loans' | 'fines' | 'reviews'; 
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentScreen }) => {

  // Função auxiliar para estilizar os botões dinamicamente
  const getButtonStyle = (screenName: 'users' | 'books' | 'loans' | 'fines' | 'reviews') => ({
    marginRight: '10px', 
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: currentScreen === screenName ? 'bold' : 'normal',
    backgroundColor: currentScreen === screenName ? '#0056b3' : 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '4px'
  });

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* CABEÇALHO */}
      <header style={{ 
        backgroundColor: '#007bff', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1>📚 Estante Virtual</h1>
        <nav>
          <button 
            onClick={() => onNavigate('users')} 
            style={getButtonStyle('users')}
          >
            Usuários
          </button>

          <button 
            onClick={() => onNavigate('books')}
            style={getButtonStyle('books')}
          >
            Livros
          </button>

          <button 
            onClick={() => onNavigate('loans')}
            style={getButtonStyle('loans')}
          >
            Empréstimos
          </button>

          <button 
            onClick={() => onNavigate('fines')}
            style={getButtonStyle('fines')}
          >
            Multas
          </button>
          
          {/* NOVO BOTÃO DE NAVEGAÇÃO */}
          <button 
            onClick={() => onNavigate('reviews')}
            style={getButtonStyle('reviews')}
          >
            Avaliações
          </button>
          
        </nav>
      </header>
      
      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ padding: '20px', flex: 1 }}>
        {children}
      </main>
      
      {/* RODAPÉ */}
      <footer style={{ 
        padding: '10px', 
        backgroundColor: '#f4f4f4', 
        textAlign: 'center', 
        marginTop: 'auto' 
      }}>
        &copy; 2025 Projeto Estante Virtual 
      </footer>
    </div>
  );
};

export default Layout;