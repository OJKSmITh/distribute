class BoardRepository {
    constructor({ sequelize, Sequelize }) {
        this.User = sequelize.models.User
        this.Board = sequelize.models.Board
        this.comment = sequelize.models.comment
        this.liked = sequelize.models.Liked
        this.hash = sequelize.models.Hash
        this.hashtag = sequelize.models.Hashtag
        this.category = sequelize.models.category
        this.queryTypes = sequelize.QueryTypes
        this.sequelize = sequelize
        this.Sequelize = Sequelize
    }

    async randomValue() {
        try {
            const boardRandom = await this.Board.findAll({ order: this.sequelize.literal('rand()'), limit: 7, raw: true })
            return boardRandom
        } catch (e) {
            throw new Error(`error while finding randomValue: ${e.message}`)
        }
    }

    async hotValue() {
        try {
            const boardHot = await this.Board.findAll({ order: this.sequelize.literal('liked DESC'), limit: 3, raw: true })
        } catch (e) {
            throw new Error(`error while finding hotValue: ${e.message}`)
        }
    }


    async findUserInfo(payload) {
        const { userId } = payload
        const userInfo = await this.User.findOne({ userId, raw: true })
        return userInfo
    }

    async createBoard(payload) {
        try {
            const { subject, content, categoryMain, categorySub, hash, userId } = payload
            const hashValue = hash.reduce((acc, value, index) => {
                acc[`hash${index + 1}`] = value
                return acc
            }, {})
            const newBoard = await this.Board.create({ subject, content, categoryMain, categorySub, userId }, { plain: true })

            if (hashValue) {
                const boardContent = await this.Board.findOne({ where: { subject }, raw: true })
                const { boardIdx } = boardContent
                for (let i = 0; i < Object.keys(hashValue).length; i++) {
                    const result = hash[i]
                    const newHashTag = await this.hashtag.create({ hashtagIdx: boardIdx, tag: result })
                }
                for (let j = 1; j <= hash.length; j++) {
                    const newHash = await this.hash.findOrCreate({
                        where: { boardIdx, hashTagIdx: j },
                        defaults: {
                            boardIdx,
                            hashTagIdx: j,
                        },
                    })
                }
            }
            const hashtagValue = await this.sequelize.query("SELECT B.boardIdx, A.tag FROM Hashtag A LEFT JOIN Hash B ON A.hashTagIdx = B.hashTagIdx", { type: this.queryTypes.SELECT })
            return { newBoard, hashtagValue }
        } catch (error) {
            throw new Error(`Error while creating board: ${error.message}`)
        }
    }

    async insertLike(payload) {
        try {
            const { userId, boardIdx, categoryMain } = payload
            const likeResult = await this.liked.findOrCreate({
                where: { userId, boardIdx },
                defaults: {
                    userId,
                    boardIdx,
                },
            })
            const likeresult = likeResult[0].dataValues
            if (likeResult[1]) {
                const likeCount = await this.liked.findAll({
                    where: {
                        boardIdx,
                    },
                    raw: true,
                })
                const likeValue = likeCount.length
                const boardLike = await this.Board.update({ liked: likeValue }, { where: { boardIdx } })
                return boardLike
            } else {
                const likeDelete = await this.liked.destroy({
                    where: {
                        userId
                    }
                })
                const likeCount = await this.liked.findAll({
                    where: {
                        boardIdx,
                    },
                    raw: true,
                })
                const likeValue = likeCount.length
                const boardLike = await this.Board.update({ liked: likeValue }, { where: { boardIdx } })
                return boardLike
            }
        } catch (e) {
            throw new Error(`Error while insert status: ${e.message}`)
        }
    }

    async findValue(payload) {
        try {
            const { boardIdx } = payload
            const response = await this.Board.findOne({ where: { boardIdx }, raw: true })
            return response
        } catch (e) {
            throw new Error(`Error while find status: ${e.message}`)
        }
    }

    async deleteValue(payload) {
        try {
            const { boardIdx } = payload
            const response = await this.Board.findOne({ where: { boardIdx }, raw: true })
            if (response) {
                const result = await this.Board.destroy({ where: { boardIdx } })
                console.log(result)
            }
            console.log(response)

        } catch (e) {
            throw new Error(`Error while delete status: ${e.message}`)
        }
    }
}

module.exports = BoardRepository
