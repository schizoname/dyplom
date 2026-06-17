import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  NavLink,
  useNavigate
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        menuRef.current
        && !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    document.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );

      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, []);

  if (!user) {
    return null;
  }

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    navigate('/login');
  }

  return (
    <div
      className="user-menu"
      ref={menuRef}
    >
      <button
        className="user-menu-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() =>
          setIsOpen((current) => !current)
        }
      >
        <Avatar
          user={user}
          size="small"
        />

        <span className="user-menu-name">
          {user.name}
        </span>

        <span
          className={
            `user-menu-arrow ${
              isOpen
                ? 'user-menu-arrow-open'
                : ''
            }`
          }
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          className="user-menu-dropdown"
          role="menu"
        >
          <NavLink
            className="user-menu-item"
            to="/my-blocks"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Мої блоки
          </NavLink>
          <NavLink
            className="user-menu-item"
            to="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Налаштування
          </NavLink>

          <button
            className={
              'user-menu-item user-menu-logout'
            }
            type="button"
            role="menuitem"
            onClick={handleLogout}
          >
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}