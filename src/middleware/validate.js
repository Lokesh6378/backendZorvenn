export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const flat = result.error.flatten();
    return res.status(400).json({
      message: flat.formErrors[0] || 'Some fields need attention.',
      errors: flat.fieldErrors,
    });
  }
  req.body = result.data;
  next();
};
