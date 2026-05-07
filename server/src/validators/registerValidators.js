// server/src/validators/registerValidators.js
const { z } = require("zod");

const registerDirectorSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  members: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        role: z.string().min(1).max(100),
      })
    )
    .default([]),
});

module.exports = {
  registerDirectorSchema,
};
