import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import {
  deleteTextBlock,
  getMyTextBlocks
} from '../api/blocksApi';
import { useAuth } from '../context/AuthContext';
import type { MyTextBlock } from '../types/textBlock';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function MyBlocksPage() {
  const { user, loading: authLoading } = useAuth();

  const [blocks, setBlocks] = useState<MyTextBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let active = true;

    async function loadBlocks() {
      try {
        setLoading(true);
        setError('');

        const result = await getMyTextBlocks();

        if (active) {
          setBlocks(result);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Не вдалося завантажити блоки.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBlocks();

    return () => {
      active = false;
    };
  }, [authLoading, user]);

  async function copyLink(block: MyTextBlock) {
    const fullUrl = `${window.location.origin}${block.publicUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(block.slug);

      window.setTimeout(() => {
        setCopiedSlug((current) =>
          current === block.slug ? null : current
        );
      }, 1800);
    } catch {
      setError('Не вдалося скопіювати посилання.');
    }
  }

  async function handleDelete(block: MyTextBlock) {
    const confirmed = window.confirm(
      `Видалити блок «${block.title}»? Цю дію неможливо скасувати.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingSlug(block.slug);
      setError('');

      await deleteTextBlock(block.slug);

      setBlocks((current) =>
        current.filter((item) => item.slug !== block.slug)
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не вдалося видалити блок.'
      );
    } finally {
      setDeletingSlug(null);
    }
  }

  if (authLoading) {
    return (
      <section className="panel state-panel">
        <h1>Завантаження...</h1>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <section className="panel state-panel">
        <h1>Завантаження...</h1>
        <p>Отримуємо список ваших блоків.</p>
      </section>
    );
  }

  return (
    <section className="panel my-blocks-page">
      <header className="my-blocks-header">
        <div>
          <p className="eyebrow">Особистий кабінет</p>
          <h1>Мої блоки</h1>
          <p className="my-blocks-subtitle">
            Створені вами текстові блоки та посилання для їх перегляду.
          </p>
        </div>

        <Link className="primary-link" to="/">
          Створити блок
        </Link>
      </header>

      {error && <div className="form-error">{error}</div>}

      {blocks.length === 0 ? (
        <div className="my-blocks-empty">
          <h2>У вас ще немає блоків</h2>
          <p>
            Створіть перший текстовий блок, щоб він з’явився у цьому списку.
          </p>
          <Link className="primary-link" to="/">
            Створити перший блок
          </Link>
        </div>
      ) : (
        <div className="my-blocks-list">
          {blocks.map((block) => {
            const isDeleting = deletingSlug === block.slug;

            return (
              <article className="my-block-card" key={block.slug}>
                <div className="my-block-main">
                  <div className="my-block-title-row">
                    <h2>{block.title}</h2>

                    <span
                      className={
                        block.active
                          ? 'block-status block-status-active'
                          : 'block-status block-status-expired'
                      }
                    >
                      {block.active ? 'Активний' : 'Завершений'}
                    </span>
                  </div>

                  <button
                    className="my-block-url"
                    type="button"
                    title="Скопіювати посилання"
                    onClick={() => void copyLink(block)}
                  >
                    {window.location.origin}
                    {block.publicUrl}
                  </button>

                  <div className="my-block-meta">
                    <span>Створено: {formatDate(block.createdAt)}</span>
                    <span>Діє до: {formatDate(block.expiresAt)}</span>
                    <span>Переглядів: {block.viewsCount}</span>
                  </div>
                </div>

                <div className="my-block-actions">
                  <Link className="block-action-link" to={block.publicUrl}>
                    Відкрити
                  </Link>

                  <Link
                    className="block-action-link"
                    to={`/edit/${block.slug}`}
                  >
                    Редагувати
                  </Link>

                  <button
                    className="block-action-button"
                    type="button"
                    onClick={() => void copyLink(block)}
                  >
                    {copiedSlug === block.slug
                      ? 'Скопійовано'
                      : 'Копіювати'}
                  </button>

                  <button
                    className="block-action-button block-action-delete"
                    type="button"
                    disabled={isDeleting}
                    onClick={() => void handleDelete(block)}
                  >
                    {isDeleting ? 'Видалення...' : 'Видалити'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
