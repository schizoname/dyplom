import {
  useEffect,
  useState
} from 'react';

import type { AuthUser } from '../types/auth';

const API_URL =
  import.meta.env.VITE_API_URL ?? '/api';

type AvatarProps = {
  user: AuthUser;
  size?: 'small' | 'large';
  className?: string;
};

export function Avatar({
  user,
  size = 'small',
  className = ''
}: AvatarProps) {
  const [imageFailed, setImageFailed] =
    useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [
    user.hasAvatar,
    user.avatarVersion
  ]);

  const showImage =
    user.hasAvatar && !imageFailed;

  const avatarUrl =
    `${API_URL}/auth/avatar`
    + `?v=${user.avatarVersion ?? 0}`;

  return (
    <span
      className={
        `avatar avatar-${size} ${className}`
      }
      aria-label={`Аватар користувача ${user.name}`}
    >
      {showImage ? (
        <img
          className="avatar-image"
          src={avatarUrl}
          alt=""
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="avatar-fallback">
          {user.avatarText}
        </span>
      )}
    </span>
  );
}