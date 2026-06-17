import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="panel state-panel">
      <p className="eyebrow">404</p>
      <h1>Сторінку не знайдено</h1>
      <p>
        Можливо, посилання введено неправильно або текстовий блок був видалений після завершення терміну дії.
      </p>
      <Link className="primary-link" to="/">Повернутися на головну</Link>
    </div>
  );
}
