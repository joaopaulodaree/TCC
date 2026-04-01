import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

type Tab = 'login' | 'register';

function getPasswordStrength(password: string): { level: number; label: string } {
  if (password.length === 0) return { level: 0, label: '' };
  if (password.length < 6) return { level: 1, label: 'Fraca' };
  if (password.length < 10 || !/[0-9]/.test(password)) return { level: 2, label: 'Média' };
  return { level: 3, label: 'Forte' };
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const strength = getPasswordStrength(password);
  const strengthClass = strength.level === 1 ? 'weak' : strength.level === 2 ? 'medium' : strength.level === 3 ? 'strong' : '';

  function switchTab(t: Tab) {
    setTab(t);
    setErrorMsg('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validations
    if (tab === 'register') {
      if (name.trim().length < 2) {
        setErrorMsg('Nome deve ter pelo menos 2 caracteres.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg('Por favor, insira um email válido.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas não coincidem.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (tab === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />
      </div>

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <Zap size={20} color="#fff" />
          </div>
          <span className="login-brand-name">TCC Assistant</span>
        </div>

        <h1 className="login-heading">
          {tab === 'login' ? 'Bem-vindo de volta' : 'Criar uma conta'}
        </h1>
        <p className="login-subheading">
          {tab === 'login'
            ? 'Faça login para continuar suas conversas'
            : 'Preencha os dados para começar'}
        </p>

        {/* Tab switcher */}
        <div className="login-tabs" role="tablist">
          <button
            role="tab"
            id="tab-login"
            aria-selected={tab === 'login'}
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            role="tab"
            id="tab-register"
            aria-selected={tab === 'register'}
            className={`login-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            Criar conta
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Name field (register only) */}
          {tab === 'register' && (
            <div className="login-field">
              <label className="login-label" htmlFor="input-name">Nome de usuário</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon"><User size={15} /></span>
                <input
                  id="input-name"
                  type="text"
                  className="login-input"
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="input-email">Email</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon"><Mail size={15} /></span>
              <input
                id="input-email"
                type="email"
                className="login-input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="input-password">Senha</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon"><Lock size={15} /></span>
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder={tab === 'login' ? 'Sua senha' : 'Mínimo 6 caracteres'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password strength (register only) */}
            {tab === 'register' && password.length > 0 && (
              <>
                <div className="password-strength">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`password-strength-bar ${i <= strength.level ? strengthClass : ''}`}
                    />
                  ))}
                </div>
                <span className={`password-strength-label ${strengthClass}`}>
                  {strength.label}
                </span>
              </>
            )}
          </div>

          {/* Confirm password (register only) */}
          {tab === 'register' && (
            <div className="login-field">
              <label className="login-label" htmlFor="input-confirm">Confirmar senha</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon"><Lock size={15} /></span>
                <input
                  id="input-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className={`login-input ${confirmPassword && confirmPassword !== password ? 'error' : ''}`}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowConfirm(v => !v)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="login-error" role="alert">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="btn-auth-submit"
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <><div className="login-spinner" /> {tab === 'login' ? 'Entrando...' : 'Criando conta...'}</>
            ) : (
              tab === 'login' ? 'Entrar' : 'Criar conta'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
