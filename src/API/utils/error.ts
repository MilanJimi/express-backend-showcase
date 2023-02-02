export class UserFacingError extends Error {
  userFacingMessage: string
  constructor(userFacingMessage: string) {
    super(userFacingMessage)
    this.userFacingMessage = userFacingMessage
  }
}
