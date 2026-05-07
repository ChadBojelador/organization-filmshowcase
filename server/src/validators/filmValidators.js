const { z } = require("zod");

const optionalDateString = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "releaseDate must be a valid date string.",
  });

const addFilmSchema = z
  .object({
    title: z.string().trim().min(1, "title is required."),
    description: z.string().trim().max(1000).optional(),
    thumbnailUrl: z.string().trim().url("thumbnailUrl must be a valid URL.").optional(),
    releaseDate: optionalDateString.optional(),
    views: z.number().int().min(0).optional(),
    fileId: z.string().trim().optional(),
    googleDriveUrl: z.string().trim().url("googleDriveUrl must be a valid URL.").optional(),
  })
  .refine((payload) => Boolean(payload.fileId || payload.googleDriveUrl), {
    message: "Either fileId or googleDriveUrl is required.",
    path: ["fileId"],
  });

const updateFilmSchema = z
  .object({
    title: z.string().trim().min(1, "title is required.").optional(),
    description: z.string().trim().max(1000).optional(),
    thumbnailUrl: z.string().trim().url("thumbnailUrl must be a valid URL.").optional(),
    releaseDate: optionalDateString.optional(),
    fileId: z.string().trim().optional(),
    googleDriveUrl: z.string().trim().url("googleDriveUrl must be a valid URL.").optional(),
  });

module.exports = {
  addFilmSchema,
  updateFilmSchema,
};
