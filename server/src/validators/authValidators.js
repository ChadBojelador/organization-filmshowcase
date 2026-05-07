const { z } = require("zod");

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2).max(100).optional(),
});

module.exports = {
  signInSchema,
  signUpSchema,
};
