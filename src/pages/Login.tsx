import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validação dos campos
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      setErro('Por favor, insira um email válido');
      return;
    }

    // Validação das credenciais
    if (email === 'gabriel@test.com' && senha === 'gabriel1805') {
      // Salva o estado de autenticação
      sessionStorage.setItem('isAuthenticated', 'true');
      // Redireciona para a página de lançamentos
      navigate('/lancamentos');
    } else {
      setErro('Email ou senha incorretos');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <span className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>Logo</span>
        <h1>Livro Caixa</h1>
      </div>
      
      <div className="login-form-container">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu Email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua Senha"
            />
          </div>

          {erro && (
            <div style={{
              color: '#ff0000',
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {erro}
            </div>
          )}

          <button type="submit" className="submit-button">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
