import { IPageable } from '@/shared/utils/IPageable'
import { Prisma, PrismaClient } from '@prisma/client'
import { PageRequest } from '@app/dtos/PageRequestDto'

export class RepositoryHelper<DomainModel> {
  constructor(private readonly client: PrismaClient) {
    this.paginate = this.paginate.bind(this)
  }

  public async paginate(
    model: any,
    where: any,
    PageRequest: PageRequest,
    options?: Prisma.SelectAndInclude
  ): Promise<IPageable<DomainModel>> {
    const { limit, page, sort } = PageRequest

    const condition: any = {
      where,
      take: limit,
      skip: (page - 1) * limit
    }

    if (sort) {
      condition.orderBy = {
        [sort.field]: sort.order
      }
    }

    if (options && options.select) {
      condition.select = options.select
    }

    if (options && options.include) {
      condition.include = options.include
    }

    const [data, count] = await this.client.$transaction([
      model.findMany(condition),
      model.count(condition.where)
    ])

    const itemsReturned = data.length
    const totalItems = count
    const currentPage = page
    const totalPages = Math.ceil(count / limit)
    const hasNext = currentPage < totalPages
    const hasPrev = currentPage > 1
    const nextPage = hasNext ? currentPage + 1 : null
    const prevPage = hasPrev ? currentPage - 1 : null

    return {
      data,
      itemsReturned,
      totalItems,
      currentPage,
      totalPages,
      hasNext,
      hasPrev,
      nextPage,
      prevPage
    }
  }
}
