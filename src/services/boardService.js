/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async reqBody => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    //Gọi tới tầng Modal để xử lý lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(newBoard)

    //Lấy bản ghi board sau khi gọi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async boardId => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    //Xử lý cấp độ object của đối tượng: columns(parent) -> cards(child)
    const resBoard = cloneDeep(board)
    //Đưa card về đúng column
    resBoard.columns.forEach(column => {
      //Mongo support equals so sánh ObjectId
      column.cards = resBoard.cards.filter(card =>
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

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDiffCols = async reqBody => {
  try {
    //Cập nhật mảng cardOrderIds của column ban đầu
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    //Cập nhật mảng cardOrderIds của column đích
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    //Cập nhật lại columnId của card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDiffCols
}
