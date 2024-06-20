const { Router } = require('express');
const {
  createChat,
  getAllChats,
  sendMessage,
  getChat,
  readMessages,
  registerUser
} = require('./controller');
const authenticateJWT = require('../../middleware/authenticate-jwt');
const validators = require("./validator");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});



const router = Router();

// router.use(authenticateJWT);



// router.post('/:receiverId', validator.params(validators.createChat.params), createChat);
// router.get('/all', getAllChats);
// router.get('/:receiverId', validator.params(validators.getChat.params), getChat);
// router.post('/send-message/:receiverId', [validator.params(validators.sendMessage.params), validator.body(validators.sendMessage.body)], sendMessage);
// router.put('/read-messages/:chatId', validator.params(validators.readMessages.params), readMessages);

router.post('/register', validator.body(validators.registerUser.body), registerUser)

module.exports = router;
