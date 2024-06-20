const config = require("../../config/config");
const db = require("../../models");
const initModels = require("../../models/init-models");
const jwt = require('jsonwebtoken');
const { chat_messages } = initModels(db.sequelize);


module.exports = {
    getUnreadMessagesCount: async (userId) => {

        const unreadMessages = await chat_messages.count({
            where: {
                receiver_id: userId,
                is_read: false
            }
        })

        return unreadMessages

    },
    generateJwt: (user) => {
        const token = jwt.sign({ id: user.id }, config.jwt_secret_key, {
            expiresIn: '1h' // Token expires in 1 hour
        });
        return token
    }
}