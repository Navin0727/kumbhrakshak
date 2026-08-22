const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Generate JWT token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, pilgrimId: user.pilgrimId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

/**
 * Request OTP — stores OTP on user record (creates user if not found).
 */
async function requestOtp({ phoneNumber, fullName, bloodGroup, ageGroup, originCity }) {
  let user = await User.findOne({ phoneNumber });

  const otpCode = env.OTP_DEMO_MODE ? env.OTP_DEMO_CODE : generateRandomOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  if (!user) {
    // Generate unique pilgrimId
    const pilgrimId = `KMB-2027-${Math.floor(1000 + Math.random() * 9000)}`;
    user = new User({
      fullName,
      phoneNumber,
      bloodGroup: bloodGroup || 'Unknown',
      ageGroup: ageGroup || '',
      originCity: originCity || '',
      pilgrimId,
      otpCode,
      otpExpiresAt,
    });
    await user.save();
  } else {
    // Update OTP for existing user
    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    if (fullName) user.fullName = fullName;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (ageGroup) user.ageGroup = ageGroup;
    await user.save();
  }

  // In production, send OTP via SMS here
  return {
    message: `OTP sent to +91 ${phoneNumber}`,
    otpSent: true,
    // Only include OTP in demo mode for easy testing
    ...(env.OTP_DEMO_MODE && { demoOtp: otpCode }),
  };
}

/**
 * Verify OTP and return JWT + user profile.
 */
async function verifyOtp({ phoneNumber, otp, fullName, bloodGroup, ageGroup, language }) {
  const user = await User.findOne({ phoneNumber }).select('+otpCode +otpExpiresAt');
  if (!user) {
    throw ApiError.notFound('No OTP request found for this number. Please request OTP first.');
  }

  // In demo mode, accept the demo code
  if (env.OTP_DEMO_MODE) {
    if (otp !== env.OTP_DEMO_CODE) {
      throw ApiError.unauthorized('Invalid OTP. Demo code is ' + env.OTP_DEMO_CODE);
    }
  } else {
    if (user.otpCode !== otp) {
      throw ApiError.unauthorized('Invalid OTP');
    }
    if (user.otpExpiresAt < new Date()) {
      throw ApiError.unauthorized('OTP has expired. Please request a new one.');
    }
  }

  // Clear OTP fields
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  if (fullName) user.fullName = fullName;
  if (bloodGroup) user.bloodGroup = bloodGroup;
  if (ageGroup) user.ageGroup = ageGroup;
  if (language) user.language = language;
  user.isRegistered = true;
  await user.save();

  const token = generateToken(user);
  const profile = user.toJSON();

  return { token, user: profile };
}

/**
 * Login via Pilgrim Pass ID.
 */
async function loginPassId({ passId, passSecret }) {
  let user = await User.findOne({ pilgrimId: passId.toUpperCase() });

  if (!user) {
    // Create a generic pilgrim account
    user = new User({
      fullName: 'Verified Pilgrim',
      phoneNumber: passSecret ? `XXXXX${passSecret}` : '0000000000',
      pilgrimId: passId.toUpperCase(),
      isRegistered: true,
    });
    await user.save();
  }

  const token = generateToken(user);
  return { token, user: user.toJSON() };
}

/**
 * Login as official/duty staff via badge number.
 */
async function loginOfficial({ badgeNumber, dutySector }) {
  let user = await User.findOne({ pilgrimId: badgeNumber.toUpperCase() });

  if (!user) {
    user = new User({
      fullName: `Officer (${badgeNumber.trim() || 'Staff'})`,
      phoneNumber: '0000000000',
      pilgrimId: badgeNumber.toUpperCase(),
      role: 'official',
      badgeNumber,
      dutySector: dutySector || '',
      isRegistered: true,
    });
    await user.save();
  }

  const token = generateToken(user);
  return { token, user: user.toJSON() };
}

/**
 * Guest emergency access (no auth, limited profile).
 */
async function guestAccess() {
  const guestId = `KMB-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
  const user = new User({
    fullName: 'Emergency Guest Pilgrim',
    phoneNumber: 'Not Linked',
    pilgrimId: guestId,
    isRegistered: false,
    role: 'pilgrim',
  });
  await user.save();

  const token = generateToken(user);
  return { token, user: user.toJSON() };
}

/**
 * Get user profile by ID.
 */
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toJSON();
}

/**
 * Update user profile.
 */
async function updateProfile(userId, updates) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const allowedFields = [
    'fullName', 'ageGroup', 'language', 'bloodGroup',
    'allergies', 'medicalConditions', 'currentMedications',
    'mobilityAssistance', 'emergencyContact',
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  }

  await user.save();
  return user.toJSON();
}

function generateRandomOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports = {
  requestOtp,
  verifyOtp,
  loginPassId,
  loginOfficial,
  guestAccess,
  getProfile,
  updateProfile,
};
