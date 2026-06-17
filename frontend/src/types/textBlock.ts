export type CreateBlockRequest = {
  title: string;
  text: string;
  expirationMinutes: number;
};

export type UpdateBlockRequest = {
  title: string;
  text: string;
  expirationMinutes?: number;
};

export type TextBlockResponse = {
  slug: string;
  publicUrl: string;
  expiresAt: string;
};

export type TextBlockView = {
  slug: string;
  title: string;
  text: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
  active: boolean;
  canManage: boolean;
};

export type TextBlockEdit = {
  slug: string;
  title: string;
  text: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
};

export type MyTextBlock = {
  slug: string;
  title: string;
  publicUrl: string;
  createdAt: string;
  expiresAt: string;
  viewsCount: number;
  active: boolean;
};