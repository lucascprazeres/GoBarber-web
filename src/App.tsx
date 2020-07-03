import React from 'react';

import GlobalStyle from './styles/global';

import SignIn from './pages/SignIn';

import { AuthProvider } from './contexts/AuthContext';
// import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <SignIn />
      </AuthProvider>

      <GlobalStyle />
    </>
  );
};

export default App;
