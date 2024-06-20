const asyncHandler = require('../../utils/error-handlers/catch-async.js');
const { sequelize, Sequelize } = require('../../models/index.js');
const { Op } = require('sequelize');
const { sendSuccess } = require('../../utils/response/response-utils.js');
const { emitSocketEvent } = require('../../lib/socket/socket-manager.js');
const { CHAT_EVENTS } = require('../../lib/socket/chat-events.js');
const initModels = require('../../models/init-models.js');
const db = require('../../models/index.js');
const { getPaginatedResults } = require('../../utils/helpers.js');
const { getUnreadMessagesCount, generateJwt } = require('./controller-utils.js');
const { RESPONSE_MSGS } = require('../../utils/response/response-messages.js');
const STATUS_CODES = require('../../utils/response/status-codes.js');


const { users } = initModels(db.sequelize);

module.exports = {
  // createChat: asyncHandler(async (req, res, next) => {
  //   const { receiverId } = req.params;
  //   let chat = await chat_constants.findOne({
  //     where: {
  //       [Op.or]: [
  //         {
  //           user1_id: receiverId,
  //           user2_id: req.user.id,
  //         },
  //         {
  //           user1_id: req.user.id,
  //           user2_id: receiverId,
  //         },
  //       ],
  //     },
  //     raw: true,
  //   });

  //   if (!chat) {
  //     const createChat = await chat_constants.create({
  //       user1_id: req.user.id,
  //       user2_id: receiverId,
  //     });

  //     return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.CHAT_CREATED, createChat);
  //   }

  //   return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.CHAT_CREATED, chat);
  // }),
  // getAllChats: asyncHandler(async (req, res, next) => {
  //   const chats = await sequelize.query(
  //     `
  // SELECT 
  //   c.*,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN u1.id
  //     ELSE u2.id
  //   END AS sender_id,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN u1.name
  //     ELSE u2.name
  //   END AS sender_name,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN u1.email
  //     ELSE u2.email
  //   END AS sender_email,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN p1.image
  //     ELSE p2.image
  //   END AS sender_image,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN u2.id
  //     ELSE u1.id
  //   END AS receiver_id,
  //       (
  //     SELECT is_online
  //     FROM users u
  //     WHERE u.id = (
  //       CASE 
  //         WHEN c.user1_id = :loggedInUser THEN u2.id
  //         ELSE u1.id
  //       END
  //     )
  //   ) AS is_online,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN u2.name
  //     ELSE u1.name
  //   END AS receiver_name,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN u2.email
  //     ELSE u1.email
  //   END AS receiver_email,
  //   CASE 
  //     WHEN c.user1_id = :loggedInUser THEN p2.image
  //     ELSE p1.image
  //   END AS receiver_image,
  //   (
  //     SELECT COUNT(*)
  //     FROM chat_messages
  //     WHERE chat_id = c.id
  //       AND receiver_id = :loggedInUser
  //       AND is_read = false
  //   ) AS unread_messages_count,
  //      (
  //     SELECT message
  //     FROM chat_messages
  //     WHERE c.last_message_id = chat_messages.id
  //   ) AS last_message

  // FROM 
  //   chat_constants c
  // JOIN 
  //   users u1 ON c.user1_id = u1.id
  // JOIN 
  //   users u2 ON c.user2_id = u2.id
  // LEFT JOIN
  //   profile_e p1 ON u1.id = p1.user_id
  // LEFT JOIN
  //   profile_e p2 ON u2.id = p2.user_id
  // WHERE 
  //   c.user1_id = :loggedInUser OR c.user2_id = :loggedInUser
  // `,
  //     {
  //       replacements: { loggedInUser: req.user.id },
  //       type: Sequelize.QueryTypes.SELECT,
  //     }
  //   );

  //   return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.GET_ALL_CHAT, chats);
  // }),
  // sendMessage: asyncHandler(async (req, res, next) => {
  //   const { receiverId } = req.params;
  //   const { message } = req.body;
  //   const currentUserId = req.user.id

  //   let chat = await chat_constants.findOne({
  //     where: {
  //       [Op.or]: [
  //         {
  //           user1_id: receiverId,
  //           user2_id: req.user.id,
  //         },
  //         {
  //           user1_id: req.user.id,
  //           user2_id: receiverId,
  //         },
  //       ],
  //     },
  //     raw: true,
  //   });

  //   if (!chat) {
  //     chat = await chat_constants.create({
  //       user1_id: req.user.id,
  //       user2_id: receiverId,
  //     });
  //   }

  //   const createMessage = await chat_messages.create({
  //     chat_id: chat.id,
  //     sender_id: req.user.id,
  //     receiver_id: receiverId,
  //     message,
  //     is_read: 0,
  //   });

  //   chat_constants.update(
  //     {
  //       last_message_id: createMessage?.id,
  //     },
  //     {
  //       where: {
  //         id: chat?.id,
  //       },
  //     }
  //   );

  //   const sendMessage = await chat_messages.findOne({
  //     where: {
  //       id: createMessage?.id,
  //     },
  //     order: [['created_at', 'ASC']], // Optionally, you can order by createdAt
  //     include: [
  //       {
  //         model: users,
  //         as: 'sender', // alias used in the association
  //         attributes: [
  //           'id',
  //           'name',
  //           [
  //             sequelize.literal(`(
  //              SELECT image 
  //              FROM profile_e 
  //              WHERE user_id = chat_messages.sender_id
  //              LIMIT 1
  //               )`),
  //             'sender_image',
  //           ],
  //         ], // specify attributes you need
  //       },
  //       {
  //         model: users,
  //         as: 'receiver', // alias used in the association
  //         attributes: [
  //           'id',
  //           'name',
  //           [
  //             sequelize.literal(`(
  //             SELECT image 
  //             FROM profile_e 
  //             WHERE user_id = chat_messages.receiver_id
  //             LIMIT 1
  //             )`),
  //             'receiver_image',
  //           ],
  //         ], // specify attributes you need
  //       },
  //     ],
  //     raw: true,
  //     nest: true,
  //   });

  //   // emit the receive message event to the other participants with received message as the payload
  //   emitSocketEvent(
  //     req,
  //     receiverId.toString(),
  //     CHAT_EVENTS.MESSAGE_RECEIVED_EVENT,
  //     sendMessage
  //   );

  //   const unreadMessages = await getUnreadMessagesCount(currentUserId)

  //   // emit the receive message event to the other participants with received message as the payload

  //   emitSocketEvent(
  //     req,
  //     currentUserId.toString(),
  //     CHAT_EVENTS.READ_UNREAD_COUNT,
  //     {
  //       unreadMessages
  //     }
  //   );

  //   return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.MESSAGE_SENT, sendMessage);
  // }),
  // getChat: asyncHandler(async (req, res, next) => {
  //   const { receiverId } = req.params;
  //   const { page, limit } = req.query

  //   const user = await users.findOne({
  //     where: {
  //       id: receiverId,
  //     },
  //     attributes: [
  //       'is_online',
  //       'name',
  //       [
  //         sequelize.literal(`(
  //           SELECT image 
  //           FROM profile_e 
  //           WHERE user_id = ${receiverId}
  //           LIMIT 1
  //         )`),
  //         'receiver_image',
  //       ],
  //       [
  //         sequelize.literal(`(
  //           SELECT profession 
  //           FROM profile_e 
  //           WHERE user_id = ${receiverId}
  //           LIMIT 1
  //         )`),
  //         'profession',
  //       ],
  //       [
  //         sequelize.literal(`(
  //           SELECT office_name 
  //           FROM profile_e 
  //           WHERE user_id = ${receiverId}
  //           LIMIT 1
  //         )`),
  //         'office_name',
  //       ],
  //     ],
  //     raw: true,
  //   });


  //   const query = {
  //     where: {
  //       [Op.or]: [
  //         {
  //           sender_id: req.user.id,
  //           receiver_id: receiverId,
  //         },
  //         {
  //           sender_id: receiverId,
  //           receiver_id: req.user.id,
  //         },
  //       ],
  //     },
  //     include: [
  //       {
  //         model: users,
  //         as: 'sender', // alias used in the association
  //         attributes: [
  //           'id',
  //           'name',
  //           [
  //             sequelize.literal(`(
  //             SELECT image 
  //             FROM profile_e 
  //             WHERE user_id = chat_messages.sender_id
  //             LIMIT 1
  //            )`),
  //             'sender_image',
  //           ],
  //         ], // specify attributes you need
  //       },
  //       {
  //         model: users,
  //         as: 'receiver', // alias used in the association
  //         attributes: [
  //           'id',
  //           'name',
  //           [
  //             sequelize.literal(`(
  //             SELECT image 
  //             FROM profile_e 
  //             WHERE user_id = chat_messages.receiver_id
  //             LIMIT 1
  //              )`),
  //             'receiver_image',
  //           ],
  //         ], // specify attributes you need
  //       },
  //     ],
  //   }

  //   const chat = await getPaginatedResults({
  //     model: chat_messages,
  //     page,
  //     limit,
  //     where: query.where,
  //     includeOptions: query.include,
  //     otherOptions: {
  //       raw: true,
  //       order: [['id', 'DESC']],
  //       nest: true,
  //     }
  //   })

  //   return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.GET_CHAT, {
  //     is_online: user?.is_online,
  //     name: user?.name,
  //     receiver_image: user?.receiver_image || '',
  //     profession: user?.profession || '',
  //     office_name: user?.office_name || '',
  //     receiver_id: receiverId,
  //     chat: {
  //       ...chat,
  //       data: chat.data.reverse()
  //     },
  //   });
  // }),
  // readMessages: asyncHandler(async (req, res, next) => {

  //   const { chatId } = req.params;
  //   const currentUserId = req.user.id

  //   const chat = await chat_constants.findOne({
  //     where: {
  //       id: chatId
  //     },
  //     raw: true

  //   })


  //   const updateMessages = await chat_messages.update({
  //     is_read: 1,
  //     chat_id: chat.id
  //   }, {
  //     where: {
  //       receiver_id: currentUserId,
  //     }
  //   })

  //   const unreadMessages = await getUnreadMessagesCount(currentUserId)

  //   // emit the receive message event to the other participants with received message as the payload
  //   if (unreadMessages === 0) {
  //     emitSocketEvent(
  //       req,
  //       currentUserId.toString(),
  //       CHAT_EVENTS.READ_UNREAD_COUNT,
  //       {
  //         unreadMessages
  //       }
  //     );
  //   }

  //   return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.MESSAGES_READ)


  // }),
  registerUser: asyncHandler(async (req, res, next) => {

    const user = await users.create(req.body);


    user.dataValues.token = generateJwt(user)
    delete user.password

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.DEFAULT, user)

  })
};
