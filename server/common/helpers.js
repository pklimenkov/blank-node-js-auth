'use strict'
const formatErrors = (e) => {
  return [{ param: 'unknown', msg: e.message }]
}

const handlePagination = (page, perPage) => {
  let pageParam = 0
  try {
    pageParam = parseInt(page)
  } catch (e) { }
  let perPageParam = 20
  try {
    perPageParam = parseInt(perPage)
  } catch (e) { }
  const offset = pageParam * perPage
  return { page: pageParam, perPage: perPageParam, offset: offset }
}

export { formatErrors, handlePagination }
