import { useState, useEffect } from 'react';
import { LoginView } from './components/LoginView';
import { ServerDashboard } from './components/ServerDashboard';
import { UserManagementView } from './components/UserManagement/UserManagementView';
import { Layout } from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'servers' | 'users'>('servers');

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

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
      {currentView === 'servers' ? <ServerDashboard /> : <UserManagementView />}
    </Layout>
  );
}

export default App;
