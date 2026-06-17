import {
  useEffect,
  useRef,
  useState
} from 'react';

import type { ChangeEvent } from 'react';

import { Navigate } from 'react-router-dom';

import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export function ProfilePage() {
  const {
    user,
    loading,
    updateAvatar
  } = useAuth();

  const [avatarMenuOpen, setAvatarMenuOpen] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const avatarMenuRef =
    useRef<HTMLDivElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setAvatarMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAvatarMenuOpen(false);
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

  if (loading) {
    return (
      <section className="panel profile-card">
        <p className="profile-loading">
          Завантаження профілю...
        </p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const passwordLength = user.passwordLength ?? 0;

  const passwordMask =
    passwordLength > 0
      ? '•'.repeat(Math.min(passwordLength, 24))
      : 'Недоступно';

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError(
        'Дозволені формати: JPG, PNG та WEBP.'
      );

      event.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError(
        'Розмір аватарки не повинен перевищувати 2 МБ.'
      );

      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      await updateAvatar(file);
      setAvatarMenuOpen(false);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Не вдалося змінити аватарку.'
      );
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <section className="panel profile-card">
      <header className="profile-header">
        <div
          className="profile-avatar-container"
          ref={avatarMenuRef}
        >
          <button
            className="profile-avatar-button"
            type="button"
            aria-label="Змінити аватар"
            aria-haspopup="menu"
            aria-expanded={avatarMenuOpen}
            onClick={() =>
              setAvatarMenuOpen(
                (current) => !current
              )
            }
          >
            <Avatar
              user={user}
              size="large"
            />

            <span className="profile-avatar-overlay">
              Змінити
            </span>
          </button>

          {avatarMenuOpen && (
            <div
              className="avatar-action-menu"
              role="menu"
            >
              <button
                className="avatar-action-item"
                type="button"
                role="menuitem"
                disabled={uploading}
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                {uploading
                  ? 'Завантаження...'
                  : 'Змінити аватар'}
              </button>

              <button
                className="avatar-action-item avatar-action-cancel"
                type="button"
                role="menuitem"
                onClick={() =>
                  setAvatarMenuOpen(false)
                }
              >
                Скасувати
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            className="avatar-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </div>

        <div className="profile-heading">
          <p className="profile-eyebrow">
            Обліковий запис
          </p>

          <h1 className="profile-title">
            Мій профіль
          </h1>

          <p className="profile-subtitle">
            Особисті дані поточного користувача.
          </p>
        </div>
      </header>

      {error && (
        <div className="form-error profile-error">
          {error}
        </div>
      )}

      <dl className="profile-details">
        <div className="profile-detail-row">
          <dt>Ім’я</dt>
          <dd>{user.name}</dd>
        </div>

        <div className="profile-detail-row">
          <dt>Електронна пошта</dt>
          <dd>{user.email}</dd>
        </div>

        <div className="profile-detail-row">
          <dt>Пароль</dt>

          <dd className="profile-password-value">
            <span className="profile-password-mask">
              {passwordMask}
            </span>

            {passwordLength > 0 && (
              <span className="profile-password-count">
                {passwordLength} символів
              </span>
            )}
          </dd>
        </div>
      </dl>

      <div className="profile-note">
        <span
          className="profile-note-icon"
          aria-hidden="true"
        >
          i
        </span>

        <p>
          Сам пароль не передається із сервера та не
          відображається. У профілі показується лише
          його довжина.
        </p>
      </div>
    </section>
  );
}