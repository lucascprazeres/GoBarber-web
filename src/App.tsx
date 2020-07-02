import React from 'react';

import GlobalStyle from './styles/global';

import SignIn from './pages/SignIn';

import AuthContext from './contexts/AuthContext';
// import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <>
      <AuthContext.Provider value={{ name: 'Lucas' }}>
        <SignIn />
      </AuthContext.Provider>

      <GlobalStyle />
    </>
  );
};

export default App;
