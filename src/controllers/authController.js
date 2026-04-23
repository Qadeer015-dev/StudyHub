const AuthService = require('../services/authService');
const AppError = require('../utils/AppError');

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password, reqSource } = req.body;
      const result = await AuthService.login(email, password);

      if (reqSource === 'web') {
        // Set token cookie
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      // req.user is set by auth middleware
      res.status(200).json({
        success: true,
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { current_password, new_password } = req.body;
      const userId = req.user.id;
      const result = await AuthService.changePassword(userId, current_password, new_password);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie("token");
      res.status(200).json({
        success: true,
        message: "Logout successfully!"
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      console.log(`Received password reset request for email: ${email, req.body}`);
      await AuthService.requestPasswordReset(email);
      res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
