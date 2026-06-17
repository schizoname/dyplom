import {
  type FormEvent,
  useEffect,
  useState
} from 'react';

import {
  Link,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  getTextBlockForEdit,
  updateTextBlock
} from '../api/blocksApi';

import { useAuth } from '../context/AuthContext';

export function EditBlockPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { user, loading: authLoading } =
    useAuth();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [expiration, setExpiration] =
    useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading || !user || !slug) {
      return;
    }

    let active = true;

    async function loadBlock() {
      try {
        const block =
          await getTextBlockForEdit(slug!);

        if (active) {
          setTitle(block.title);
          setText(block.text);
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
  }, [authLoading, user, slug]);

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!slug) {
      return;
    }
    const trimmedTitle = title.trim();
    const trimmedText = text.trim();

    if (trimmedTitle.length < 7) {
      setError(
        'Назва текстового блоку повинна містити щонайменше 7 символів.'
      );
      return;
    }

    if (trimmedText.length < 8) {
      setError(
        'Текст повинен містити щонайменше 8 символів.'
      );
      return;
    }

    setSaving(true);
    setError('');

    try {
    await updateTextBlock(slug, {
      title: trimmedTitle,
      text: trimmedText,
      expirationMinutes:
        expiration === ''
          ? undefined
          : Number(expiration)
    });

      navigate(`/p/${slug}`, {
        replace: true
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не вдалося зберегти зміни.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="panel state-panel">
        <h1>Завантаження...</h1>
        <p>Отримуємо дані блоку.</p>
      </section>
    );
  }

  if (error && !title && !text) {
    return (
      <section className="panel state-panel">
        <h1>Редагування недоступне</h1>
        <p>{error}</p>

        <Link
          className="primary-link"
          to="/my-blocks"
        >
          До моїх блоків
        </Link>
      </section>
    );
  }

  return (
    <section className="panel edit-block-page">
      <header className="edit-block-header">
        <div>
          <p className="eyebrow">
            Керування блоком
          </p>

          <h1>Редагування</h1>

          <p>
            Змініть назву, текст або встановіть
            новий термін зберігання.
          </p>
        </div>

        <Link
          className="secondary-link"
          to={`/p/${slug}`}
        >
          Скасувати
        </Link>
      </header>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form
        className="edit-block-form"
        onSubmit={handleSubmit}
      >
        <label className="edit-block-field">
          <span>Назва</span>

        <input
          type="text"
          required
          minLength={7}
          maxLength={255}
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />
        </label>

        <label className="edit-block-field">
          <span>Текст</span>

        <textarea
          required
          minLength={8}
          maxLength={200000}
          rows={16}
          value={text}
          onChange={(event) =>
            setText(event.target.value)
          }
        />
        </label>

        <label className="edit-block-field">
          <span>Новий термін зберігання</span>

          <select
            value={expiration}
            onChange={(event) =>
              setExpiration(event.target.value)
            }
          >
            <option value="">
              Не змінювати
            </option>

            <option value="10">
              10 хвилин
            </option>

            <option value="60">
              1 година
            </option>

            <option value="1440">
              1 день
            </option>

            <option value="10080">
              7 днів
            </option>
          </select>

          <small>
            Новий термін відраховуватиметься
            від моменту збереження.
          </small>
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Збереження...'
            : 'Зберегти зміни'}
        </button>
      </form>
    </section>
  );
}