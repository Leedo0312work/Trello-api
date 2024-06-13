/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardType } from '~/utils/constants'

const createNew = async (req, res, next) => {
  // Create object validation
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at lesst 3 chars long',
      'string.max':
        'Title length must be less than or equal to 50 characters long',
      'string.trim': 'Title must not have leading or trailing whitesapce',
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(256)
      .trim()
      .strict()
      .messages({
        'any.required': 'Description is required',
        'string.empty': 'Description is not allowed to be empty',
        'string.min': 'Description length must be at lesst 3 chars long',
        'string.max':
          'Description length must be less than or equal to 50 characters long',
        'string.trim':
          'Description must not have leading or trailing whitesapce',
      }),
    type: Joi.string().valid(boardType.PUBLIC, boardType.PRIVATE).required(),
  })

  //Execute
  try {
    //Set boardEarly: false to return all error in once
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //Navigate to controller layer when complete validate (boardRoute - post)
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError)
  }
}

export const boardValidation = {
  createNew,
}
