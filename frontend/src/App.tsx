import { useState, useEffect } from 'react';
import { LoginView } from './components/LoginView';
import { ServerDashboard } from './components/ServerDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('crowops_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('crowops_token');
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <ServerDashboard onLogout={handleLogout} />
  ) : (
    <LoginView onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;
