class UserRepository {
    constructor({ User, sequelize }) {
        this.User = User
        this.sequelize = sequelize
    }
    async addUser(payload) {
        console.log("789", payload)
        console.log(this.User.QueryTypes)

        try {
            const user = await this.User.create(payload, { raw: true })
            return user
        } catch (e) {
            throw new Error(e)
        }
    }

    async checkId({ userId }) {
        try {
            const user = await this.User.findOne({
                raw: true,
                where: {
                    userId,
                },
            })
            return user
        } catch (e) {
            throw new Error(e)
        }
    }
    async checkNick({ nickName }) {
        try {
            const user = await this.User.findOne({
                raw: true,
                where: {
                    nickName,
                },
            })
            return user
        } catch (e) {
            throw new Error(e)
        }
    }

    async getInfo(userId) {
        try {
            const user = await this.User.findOne({
                raw: true,
                where: {
                    userId,
                },
            })
            return user
        } catch (e) {
            throw new Error(e)
        }
    }

    async updateInfo(payload) {
        try {
            const [count, affecteRows] = await this.User.update(payload, {
                where: { userId: payload.userId },
                returning: true,
            })
            if (affecteRows) {
                const response = await this.User.findOne({
                    raw: true,
                    where: {
                        userId: payload.userId,
                    },
                })
                return response
            }
            if (affecteRows === 0) throw new Error("User not found, Please redirect your webpage")
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = UserRepository
