/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModal } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    }

    //Gọi tới tầng Modal để xử lý lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModal.createNew(newBoard)
    console.log(createdBoard)

    //Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModal.findOneById(createdBoard.insertedId)
    console.log(getNewBoard)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModal.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    return board
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
}
