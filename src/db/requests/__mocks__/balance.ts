const { balanceDbQueries } =
  jest.createMockFromModule<typeof import('../balance')>('../balance')

balanceDbQueries.getSingleBalance = jest
  .fn()
  .mockImplementation(({ username, denomination }) => ({
    id: '0000',
    username,
    denomination,
    balance: 1000,
    available_balance: 500
  }))

export { balanceDbQueries }
