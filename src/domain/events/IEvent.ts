export const NEW_USER_CREATED = 'NEW_USER_CREATED'

export interface IEvent {
  getName(): string
  getPayload(): any
}
