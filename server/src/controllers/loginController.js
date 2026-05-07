// server/src/controllers/loginController.js
const { loginDirector } = require("../services/loginService");

async function login(req, res) {
  const result = await loginDirector(req.validatedBody);

  return res.status(200).json({
    success: true,
    token: result.token,
    director: result.director,
  });
}

module.exports = {
  login,
};
