/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    }

    //Gọi tới tầng Modal để xử lý lưu bản ghi newBoard vào trong database

    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
}
