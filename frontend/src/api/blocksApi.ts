import type {
  CreateBlockRequest,
  MyTextBlock,
  TextBlockEdit,
  TextBlockResponse,
  TextBlockView,
  UpdateBlockRequest
} from '../types/textBlock';

const API_URL =
  import.meta.env.VITE_API_URL ?? '/api';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string>;
};

async function getErrorMessage(
  response: Response
): Promise<string> {
  try {
    const body =
      await response.json() as ApiErrorResponse;

    const validationError =
      body.errors
        ? Object.values(body.errors)[0]
        : undefined;

    return (
      validationError ??
      body.message ??
      'Не вдалося створити текстовий блок.'
    );
  } catch {
    return 'Не вдалося створити текстовий блок.';
  }
}

export async function createTextBlock(
  data: CreateBlockRequest
): Promise<TextBlockResponse> {
  const response = await fetch(
    `${API_URL}/blocks`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  if (response.status === 401 ||
      response.status === 403) {
    throw new Error(
      'Для створення текстового блоку потрібно увійти в систему.'
    );
  }

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return response.json() as Promise<TextBlockResponse>;
}

export async function getTextBlock(
  slug: string
): Promise<TextBlockView> {
  const response = await fetch(
    `${API_URL}/blocks/${encodeURIComponent(slug)}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    }
  );

  if (response.status === 404) {
    throw new Error(
      'Текстовий блок не знайдено або термін його дії завершився.'
    );
  }

  if (!response.ok) {
    throw new Error(
      'Не вдалося завантажити текстовий блок.'
    );
  }

  return (await response.json()) as TextBlockView;
}

export async function getMyTextBlocks():
Promise<MyTextBlock[]> {
  const response = await fetch(
    `${API_URL}/blocks/my`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    }
  );

  if (
    response.status === 401 ||
    response.status === 403
  ) {
    throw new Error(
      'Для перегляду своїх блоків потрібно увійти в систему.'
    );
  }

  if (!response.ok) {
    throw new Error(
      'Не вдалося завантажити список текстових блоків.'
    );
  }

  return (await response.json()) as MyTextBlock[];
}

export async function getTextBlockForEdit(
  slug: string
): Promise<TextBlockEdit> {
  const response = await fetch(
    `${API_URL}/blocks/${encodeURIComponent(slug)}/edit`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    }
  );

  if (response.status === 401) {
    throw new Error(
      'Для редагування потрібно увійти в систему.'
    );
  }

  if (response.status === 403) {
    throw new Error(
      'Ви не є власником цього текстового блоку.'
    );
  }

  if (response.status === 404) {
    throw new Error(
      'Текстовий блок не знайдено.'
    );
  }

  if (!response.ok) {
    throw new Error(
      'Не вдалося завантажити текстовий блок.'
    );
  }

  return (await response.json()) as TextBlockEdit;
}

export async function updateTextBlock(
  slug: string,
  data: UpdateBlockRequest
): Promise<TextBlockView> {
  const response = await fetch(
    `${API_URL}/blocks/${encodeURIComponent(slug)}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  if (response.status === 401) {
    throw new Error(
      'Для редагування потрібно увійти в систему.'
    );
  }

  if (response.status === 403) {
    throw new Error(
      'Ви не є власником цього текстового блоку.'
    );
  }

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response)
    );
  }

  return (await response.json()) as TextBlockView;
}

export async function deleteTextBlock(
  slug: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/blocks/${encodeURIComponent(slug)}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  if (response.status === 401) {
    throw new Error(
      'Для видалення потрібно увійти в систему.'
    );
  }

  if (response.status === 403) {
    throw new Error(
      'Ви не є власником цього текстового блоку.'
    );
  }

  if (response.status === 404) {
    throw new Error(
      'Текстовий блок уже видалено або не знайдено.'
    );
  }

  if (!response.ok) {
    throw new Error(
      'Не вдалося видалити текстовий блок.'
    );
  }
}