import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Паролі не збігаються.');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зареєструватися.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel narrow-panel auth-panel">
      <p className="eyebrow">Новий користувач</p>
      <h1>Реєстрація в TextLink</h1>
      <p className="auth-description">Створіть обліковий запис для роботи із системою.</p>

      <form className="inner-form" onSubmit={handleSubmit}>
        <label>
          Ім’я
          <input
            type="text"
            autoComplete="name"
            placeholder="Ваше ім’я"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={5}
            maxLength={20}
            required
          />
        </label>

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
            autoComplete="new-password"
            placeholder="Не менше 8 символів"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>

        <label>
          Повторіть пароль
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Повторіть пароль"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            minLength={8}
            required
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Створення...' : 'Зареєструватися'}
        </button>

        {error && <div className="alert error">{error}</div>}
      </form>

      <p className="auth-switch">
        Уже маєте обліковий запис? <Link to="/login">Увійти</Link>
      </p>
    </section>
  );
}
