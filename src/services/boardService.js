/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModal } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    }

    //Gọi tới tầng Modal để xử lý lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModal.createNew(newBoard)

    //Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModal.findOneById(createdBoard.insertedId)

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

    //Xử lý cấp độ object của đối tượng: columns(parent) -> cards(child)
    const resBoard = cloneDeep(board)
    //Đưa card về đúng column
    resBoard.columns.forEach((column) => {
      //Mongo support equals so sánh ObjectId
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      )
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // )
    })

    //Xóa mảng cards nằm cùng cấp với board
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
}
