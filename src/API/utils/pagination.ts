export type Pagination = {
  perPage: number
  offset: number
}
const DEFAULT_PER_PAGE_PAGINATION = 20
const DEFAULT_PAGINATION_OFFSET = 0

export const getPagination = (perPage?: number, page?: number) => {
  const offset =
    (page && perPage && (page - 1) * perPage) || DEFAULT_PAGINATION_OFFSET

  return {
    perPage: perPage ?? DEFAULT_PER_PAGE_PAGINATION,
    offset
  }
}
