const authenticate = jest.fn().mockImplementation((req, res, next) => {
  req.body.username = 'Mock User'
  return next()
})

export { authenticate }
