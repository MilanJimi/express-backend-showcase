const { userDbQueries } =
  jest.createMockFromModule<typeof import('../user')>('../user')

userDbQueries.getUser = jest.fn().mockReturnValue([
  {
    username: 'Existing User',
    password: '$2b$10$aX7uHQDjTi6M82oQztmf5uR3AZ1GhFRfh4FpXg2OZAgmJ8sE9UvOG' // Generated from password: 'pass'
  }
])

export { userDbQueries }
