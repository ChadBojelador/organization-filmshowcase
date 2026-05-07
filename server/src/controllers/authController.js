const { signInWithPassword, signUpWithPassword } = require("../services/authService");

async function signIn(req, res) {
  const data = await signInWithPassword(req.validatedBody);

  return res.status(200).json({
    message: "Signed in successfully.",
    user: data.user,
    session: data.session,
  });
}

async function signUp(req, res) {
  const data = await signUpWithPassword(req.validatedBody);

  return res.status(201).json({
    message: "Sign-up successful.",
    user: data.user,
    session: data.session,
  });
}

module.exports = {
  signIn,
  signUp,
};
