module.exports = {
    sendError: (req, res, next) =>  {
        res.sendError = (status, msg) => {
            res.status(status).send({
                status: 'Error',
                message: msg,
            })
        }
        next()
      },

    sendResponse: (req, res, next) =>  {
        res.sendResponse = (status, data) => {
            res.status(status).send({
                status: 'success',
                Data: data
            })
        }
        next()
      }
}