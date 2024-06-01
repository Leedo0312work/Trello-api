/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Centralized Error Handleing Middleware in Back-end NodeJS App
export const errorHandlingMiddleware = (err, req, res, next) => {
  // Default statusCode 500 INTERNAL_SERVER_ERROR if doesn't exist
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Create responseError to control whatever wanted to return to client
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  }
  // console.error(responseError)

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Return responseError to Front-end
  res.status(responseError.statusCode).json(responseError)
}
