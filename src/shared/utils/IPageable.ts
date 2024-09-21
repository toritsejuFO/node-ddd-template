export interface IPageable<T> {
  data: T[]
  itemsReturned: number
  totalItems: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
}
