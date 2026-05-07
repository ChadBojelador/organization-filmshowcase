// server/src/controllers/registerController.js
const { registerDirectorWithMembers } = require("../services/directorService");

async function registerDirector(req, res) {
  const result = await registerDirectorWithMembers(req.validatedBody);

  return res.status(201).json({
    success: true,
    message: "Director registered successfully.",
    data: result,
  });
}

module.exports = {
  registerDirector,
};
