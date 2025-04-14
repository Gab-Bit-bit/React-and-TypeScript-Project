// App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Lancamentos } from './pages/Lancamentos';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLancamentosPage = location.pathname === '/lancamentos';

  // Se for página de login ou lançamentos, não mostra header/nav/footer
  if (isLoginPage || isLancamentosPage) {
    return (
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/lancamentos" 
            element={
              <ProtectedRoute>
                <Lancamentos />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    );
  }

  // Para as outras páginas, mostra header/nav/footer
  return (
    <>
      <Header />
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}