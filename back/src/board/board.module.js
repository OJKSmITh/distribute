const { Sequelize, sequelize } = require("../../models")

const fs = require("fs").promises

const BoardRepository = require("./board.repository")
const BoardService = require("./board.service")
const BoardController = require("./board.controller")

const boardRepository = new BoardRepository({ sequelize, Sequelize, sequelize })
const boardService = new BoardService({ boardRepository, fs })
const boardController = new BoardController({ boardService })

module.exports = { boardController }
