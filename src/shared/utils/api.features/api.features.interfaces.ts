export interface ReqQuery {
  keyword?: string;
  fields?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  size?: number;
}

export interface Paginate {
  limit: number;
  currentPage: number;
  documentCount: number;
  nextPage?: number;
  previousPage?: number;
}
