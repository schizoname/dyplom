import { FormEvent, useState } from 'react';
import { createTextBlock } from '../api/blocksApi';
import { CopyLinkBox } from '../components/CopyLinkBox';
import type { CreateBlockRequest } from '../types/textBlock';

const expirationOptions = [
  { label: '10 хвилин', minutes: 10 },
  { label: '1 година', minutes: 60 },
  { label: '1 день', minutes: 1440 },
  { label: '7 днів', minutes: 10080 }
];

export function HomePage() {
  const [form, setForm] = useState<CreateBlockRequest>({
    title: '',
    text: '',
    expirationMinutes: 60
  });
  const [resultLink, setResultLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof CreateBlockRequest, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setResultLink('');

const trimmedTitle = form.title.trim();
const trimmedText = form.text.trim();

if (trimmedTitle.length < 7) {
  setError('Назва текстового блоку повинна містити щонайменше 7 символів.');
  return;
}

if (trimmedText.length < 8) {
  setError('Текст повинен містити щонайменше 8 символів.');
  return;
}

    try {
      setLoading(true);
      const response = await createTextBlock({
        ...form,
        title: trimmedTitle,
        text: trimmedText
      });
      const absoluteLink = response.publicUrl.startsWith('http')
        ? response.publicUrl
        : `${window.location.origin}${response.publicUrl}`;
      setResultLink(absoluteLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-grid">
      <div className="hero-card">
        <p className="eyebrow">Швидкий обмін текстом</p>
        <h1>Створіть текстовий блок і поділіться ним за унікальним посиланням</h1>
        <p>
          Система призначена для тимчасового зберігання текстових фрагментів, технічних нотаток,
          інструкцій або коду з можливістю автоматичного видалення після заданого часу.
        </p>
        <div className="hero-stats">
          <span>Унікальний URL</span>
          <span>TTL для записів</span>
          <span>Адаптивний інтерфейс</span>
        </div>
      </div>

      <form className="panel block-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Новий текстовий блок</h2>
          <span>{form.text.length} символів</span>
        </div>

        <label>
          Назва
        <input
          type="text"
          required
          minLength={7}
          maxLength={255}
          placeholder="Мінімум 7 символів"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
        />
        </label>

        <label>
          Текст
        <textarea
          required
          minLength={8}
          maxLength={200000}
          placeholder="Мінімум 8 символів"
          value={form.text}
          onChange={(event) => updateField('text', event.target.value)}
        />
        </label>

        <label>
          Термін зберігання
          <select
            value={form.expirationMinutes}
            onChange={(event) => updateField('expirationMinutes', Number(event.target.value))}
          >
            {expirationOptions.map((option) => (
              <option key={option.minutes} value={option.minutes}>{option.label}</option>
            ))}
          </select>
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Створення...' : 'Створити посилання'}
        </button>

        {error && <div className="alert error">{error}</div>}
        {resultLink && <CopyLinkBox link={resultLink} />}
      </form>
    </section>
  );
}
