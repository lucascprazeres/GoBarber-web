import React from 'react';

import { AuthProvider } from './hooks/AuthContext';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';
import ToastContainer from './components/ToastContainer';

// import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <SignIn />
      </AuthProvider>

      <ToastContainer />

      <GlobalStyle />
    </>
  );
};

export default App;
