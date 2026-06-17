import { useState } from 'react';

type Props = {
  link: string;
};

export function CopyLinkBox({ link }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="copy-box">
      <label>Готове посилання</label>
      <div className="copy-row">
        <input value={link} readOnly />
        <button type="button" onClick={handleCopy}>{copied ? 'Скопійовано' : 'Копіювати'}</button>
      </div>
    </div>
  );
}
