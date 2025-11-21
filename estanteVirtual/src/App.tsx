import React, { useState } from 'react';
import UserList from './componentes/users/UserList';
import BookList from './componentes/books/BookList';
import LoanList from './componentes/loans/LoanList';
import FineList from './componentes/fines/FineList';
import ReviewList from './componentes/reviews/ReviewList'; 
import Layout from './componentes/Layout';

type CurrentScreen = 'users' | 'books' | 'loans' | 'fines' | 'reviews';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('users'); 

  const renderScreen = () => {
    switch (currentScreen) {
      case 'users': 
        return <UserList />;
      case 'books': 
        return <BookList />;
      case 'loans': 
        return <LoanList />;
      case 'fines': 
        return <FineList />;
      case 'reviews': 
        return <ReviewList />; 
      default: 
        return <div>Tela não encontrada</div>;
    }
  };

  return (
    <Layout onNavigate={setCurrentScreen} currentScreen={currentScreen}>
      {renderScreen()}
    </Layout>
  );
};

export default App;