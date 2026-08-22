const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const requestOtp = asyncHandler(async (req, res) => {
  const result = await authService.requestOtp(req.body);
  ApiResponse.success(res, result, 'OTP sent successfully');
});

const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body);
  ApiResponse.success(res, result, 'Login successful');
});

const loginPassId = asyncHandler(async (req, res) => {
  const result = await authService.loginPassId(req.body);
  ApiResponse.success(res, result, 'Login successful');
});

const loginOfficial = asyncHandler(async (req, res) => {
  const result = await authService.loginOfficial(req.body);
  ApiResponse.success(res, result, 'Official login successful');
});

const guestAccess = asyncHandler(async (req, res) => {
  const result = await authService.guestAccess();
  ApiResponse.success(res, result, 'Guest access granted');
});

const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user._id);
  ApiResponse.success(res, profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await authService.updateProfile(req.user._id, req.body);
  ApiResponse.success(res, profile, 'Profile updated');
});

module.exports = {
  requestOtp,
  verifyOtp,
  loginPassId,
  loginOfficial,
  guestAccess,
  getMe,
  updateProfile,
};
