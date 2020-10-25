const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
  
/*
** Get all users
** GET /api/v1/auth/users
** Private | Only admin
*/
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

/*
** Get single user
** GET /api/v1/auth/users/:id
** Private | Only admin
*/
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});


/*
** Create user
** POST /api/v1/auth/users
** Private | Only admin
*/
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});


/*
** Update user
** PUT /api/v1/auth/users/:id
** Private | Only admin
*/
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});


/*
** Delete user
** DELETE /api/v1/auth/users/:id
** Private | Only admin
*/
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    success: true
  });
});
