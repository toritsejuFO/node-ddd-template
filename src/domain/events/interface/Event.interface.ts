export const NEW_USER_CREATED = 'NEW_USER_CREATED'

export default interface Event {
  getName(): string
  getPayload(): any
}
