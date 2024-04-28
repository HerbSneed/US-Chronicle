// Import necessary modules
const crypto = require("crypto");
const { User, News } = require("../models");
const { signToken, AuthenticationError } = require("../utils");
const { sendResetEmail } = require("../utils/helpers");

// Function to generate a random reset token
function generateResetToken() {
  return crypto.randomBytes(20).toString("hex");
}

// Resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    // Resolver to get current user by email
    currentUser: async (parent, { email }) => User.findOne({ email }),
    // Resolver to get news, optionally filtered by user email
    news: async (parent, { email }) => {
      const params = email ? { email } : {};
      return News.find(params).sort({ latest_publish_date: -1 });
    },
  },

  Mutation: {
    // Resolver to register a new user
    register: async (
      parent,
      { firstName, lastName, email, password, userDefaultNews }
    ) => {
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        userDefaultNews,
      });

      // Generate JWT token for the new user
      const token = signToken(user);

      return { token, currentUser: user };
    },

    // Resolver to handle user login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      // Check if user exists
      if (!user) {
        throw new AuthenticationError("User not found");
      }

      // Check if password is correct
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password");
      }

      // Generate JWT token for the user
      const token = signToken(user);
      return { token, currentUser: user };
    },

    // Resolver to save news for a user
    saveNews: async (parent, { saveNews }, context) => {
      // Check if user is authenticated
      if (context.user) {
        // Add saved news to user's profile
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedNews: saveNews },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        // Generate new JWT token for the updated user
        const token = signToken(updatedUser);
        return { token, currentUser: updatedUser };
      } else {
        throw new AuthenticationError("User not authenticated");
      }
    },

    // Resolver to delete news from a user's saved news
    deleteNews: async (parent, { newsId }, context) => {
      // Check if user is authenticated
      if (context.user) {
        // Remove news from user's saved news
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedNews: { newsId } } },
          { new: true }
        );

        // Throw error if user is not found
        if (!updatedUser) {
          throw new AuthenticationError("Couldn't find user with this id!");
        }
        return updatedUser;
      }
      throw new AuthenticationError("User not authenticated");
    },

    // Resolver to handle forgot password functionality
    forgotPassword: async (parent, { email }, context) => {
      try {
        // Find user with the given email
        const user = await User.findOne({ email });

        // If user not found, return error
        if (!user) {
          return {
            success: false,
            message: "No account with this email address exists.",
          };
        }

        // Generate reset token and expiration
        const resetToken = generateResetToken();
        const resetTokenExpires = Date.now() + 3600000; // 1 hour time frame

        // Update user with reset token and expiration
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;

        await user.save();

        // Send reset email
        const BASE_URL =
          process.env.NODE_ENV === "production"
            ? process.env.BASE_URL
            : "http://localhost:3000";
        const emailSent = await sendResetEmail(email, resetToken, BASE_URL);

        // If email sending failed, return error
        if (!emailSent) {
          return {
            success: false,
            message:
              "Error sending the password reset email. Please try again later.",
          };
        }

        // Return success message
        return {
          success: true,
          message: "Password reset token generated successfully.",
        };
      } catch (error) {
        console.error("Error in forgotPassword resolver:", error);
        return {
          success: false,
          message: "An error occurred while processing your request.",
        };
      }
    },

    // Resolver to handle password reset
    resetPassword: async (parent, { token, newPassword }) => {
      try {
        // Find user with valid reset token and expiration
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
        });

        // If user not found, return error
        if (!user) {
          return {
            success: false,
            message: "Invalid or expired reset token.",
          };
        }

        // Update user password and clear reset token and expiration
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Return success message
        return {
          success: true,
          message: "Password reset successfully.",
        };
      } catch (error) {
        console.error("Error resetting password:", error);
        return {
          success: false,
          message: "An error occurred while resetting the password.",
        };
      }
    },
  },
};

// Export the resolvers
module.exports = resolvers;
