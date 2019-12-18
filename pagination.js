function pagination(collection, type) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit

    const results = {}
    
    const data = await collection.find(type).countDocuments().exec()
    
    if (data/limit > 1) {
      if ((data/limit - Math.trunc(Number((data/limit)))) > 0) {
        results.totalOfPages = Math.trunc(Number((data/limit))) + 1
      } else {
        results.totalOfPages = Math.trunc(Number((data/limit)))
      }
    } else {
      results.totalOfPages = ""
    }

    try {
      results.results = await collection.find(type).limit(limit).skip(startIndex).exec()
      res.pagination = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

module.exports = pagination