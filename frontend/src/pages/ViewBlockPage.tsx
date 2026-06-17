import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  deleteTextBlock,
  getTextBlock
} from '../api/blocksApi';
import type { TextBlockView } from '../types/textBlock';

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function ViewBlockPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [block, setBlock] = useState<TextBlockView | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setError('Некоректне посилання.');
      setLoading(false);
      return;
    }

    const blockSlug = slug;
    let active = true;

    async function loadBlock() {
      try {
        setLoading(true);
        setError('');

        const result = await getTextBlock(blockSlug);

        if (active) {
          setBlock(result);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Не вдалося завантажити блок.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBlock();

    return () => {
      active = false;
    };
  }, [slug]);

  async function handleDelete() {
    if (!block) {
      return;
    }

    const confirmed = window.confirm(
      `Видалити блок «${block.title}»? Цю дію неможливо скасувати.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      await deleteTextBlock(block.slug);
      navigate('/my-blocks', { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не вдалося видалити блок.'
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <section className="panel state-panel">
        <h1>Завантаження...</h1>
        <p>Отримуємо текстовий блок.</p>
      </section>
    );
  }

  if (!block) {
    return (
      <section className="panel state-panel">
        <p className="eyebrow">Помилка 404</p>
        <h1>Текстовий блок недоступний</h1>
        <p>{error || 'Текстовий блок не знайдено.'}</p>
        <Link className="primary-link" to="/">
          На головну
        </Link>
      </section>
    );
  }

  return (
    <section className="panel text-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">Текстовий блок</p>
          <h1>{block.title}</h1>
        </div>

        <div className="view-actions">
          {block.canManage && (
            <>
              <Link
                className="block-action-link"
                to={`/edit/${block.slug}`}
              >
                Редагувати
              </Link>

              <button
                className="block-action-button block-action-delete"
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
              >
                {deleting ? 'Видалення...' : 'Видалити'}
              </button>
            </>
          )}

          <Link className="secondary-link" to="/">
            Створити свій блок
          </Link>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      {!block.active && block.canManage && (
        <div className="expired-owner-notice">
          Термін дії цього блоку завершився. Він доступний лише вам як
          власнику. Відредагуйте блок і встановіть новий термін, щоб знову
          зробити його доступним за посиланням.
        </div>
      )}

      <div className="meta-row">
        <span>Створено: {formatDate(block.createdAt)}</span>
        <span>Діє до: {formatDate(block.expiresAt)}</span>
        <span>Переглядів: {block.viewsCount}</span>
      </div>

      <pre className="text-content">{block.text}</pre>
    </section>
  );
}
