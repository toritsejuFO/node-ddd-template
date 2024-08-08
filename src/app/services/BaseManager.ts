import { Logger } from '@/shared/logger'
import { Result } from 'types-ddd'

export default abstract class BaseManager {
  constructor(protected readonly logger: Logger) {
    this.logger = logger
  }

  fail(data: any) {
    if (data?.message && data?.code) {
      return Result.fail(data.message, { code: data.code })
    }

    if (typeof data === typeof Result) {
      return Result.fail(data.error(), data.metaData())
    }

    return Result.fail(data)
  }

  ok(data: any) {
    if (data?.message && data?.code) {
      return Result.Ok(data.message, { code: data.code })
    }

    if (typeof data === typeof Result) {
      return Result.Ok(data.value(), data.metaData())
    }

    return Result.Ok(data)
  }
}
