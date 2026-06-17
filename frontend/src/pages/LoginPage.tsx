import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося увійти.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel narrow-panel auth-panel">
      <p className="eyebrow">Обліковий запис</p>
      <h1>Вхід до TextLink</h1>
      <p className="auth-description">Увійдіть, щоб продовжити роботу із системою.</p>

      <form className="inner-form" onSubmit={handleSubmit}>
        <label>
          Електронна пошта
          <input
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Введіть пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Вхід...' : 'Увійти'}
        </button>

        {error && <div className="alert error">{error}</div>}
      </form>

      <p className="auth-switch">
        Ще немає облікового запису? <Link to="/register">Зареєструватися</Link>
      </p>
    </section>
  );
}
