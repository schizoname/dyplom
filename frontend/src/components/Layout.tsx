import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './UserMenu';

export function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="header">
        <Link className="logo" to="/">
          <span className="logo-mark">T</span>
          <span>TextLink</span>
        </Link>

        <nav className="nav">
          <NavLink to="/">Створити</NavLink>

          {!loading && !user && (
            <>
              <NavLink to="/login">Увійти</NavLink>
              <NavLink to="/register">Реєстрація</NavLink>
            </>
          )}

          {!loading && user && <UserMenu />}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        WEB-система для зберігання та обміну текстовими блоками за унікальним посиланням
      </footer>
    </div>
  );
}
