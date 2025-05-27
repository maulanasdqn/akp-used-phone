export type TMetaResponse = {
  page: number;
  perPage: number;
  total: number;
};

export type TMetaRequest = {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  order?: string;
  filters?: Record<string, string>;
};

export type TResponseList<T = unknown> = {
  data: T[];
  meta: TMetaResponse;
};

export type TResponseDetail<T = unknown> = {
  data: T;
  message: string;
};

export type TResponseMessage = {
  message: string;
};
