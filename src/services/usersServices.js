const { db } = require('../config/db')

// Login user service
const loginUser = async (body) => {
  try {
    const { email, password } = body
    const user = await db.model('User').login(email, password)

    // Create new tokens for user
    user.accessToken = await createAccesToken(user._id)
    user.refreshToken = await createRefreshToken(user._id)
    user.accessTokenExpireAt = await getTokenExpDate(user.accessToken)
    user.refreshTokenExpireAt = await getTokenExpDate(user.refreshToken)

    // Save the new tokens to the user
    await user.save()

    return {
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      accessTokenExpireAt: user.accessTokenExpireAt,
      refreshTokenExpireAt: user.refreshTokenExpireAt,
    }
  } catch (error) {
    throw new Error(error)
  }
}

// Sign up user service
const signupUser = async (body) => {
  try {
    const { firstName, lastName, phoneNumber, email, password, confirmPassword, socialToken } = body

    if (phoneNumber) {
      const encodedPhoneNumber = phoneNumber.replace('%2B', '+')

      if (encodedPhoneNumber.slice(0, 3) !== '+20') {
        throw new Error('Phone number not valid')
      }
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const user = await db
      .model('User')
      .signup(firstName, lastName, email, password, encodedPhoneNumber, socialToken)

    // Create new tokens for user
    user.accessToken = await createAccesToken(user._id)
    user.refreshToken = await createRefreshToken(user._id)
    user.accessTokenExpireAt = await getTokenExpDate(user.accessToken)
    user.refreshTokenExpireAt = await getTokenExpDate(user.refreshToken)

    // Save the new tokens to the user
    await user.save()

    return {
      email: user.email,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      accessTokenExpireAt: user.accessTokenExpireAt,
      refreshTokenExpireAt: user.refreshTokenExpireAt,
    }
  } catch (error) {
    throw new Error(error)
  }
}

// OAuth user service
const socialRegister = async (body) => {
  try {
    if (!body.email || !body.socialToken) throw new Error('Failed to register user')

    const isUser = await db.model('User').findOne({ email: body.email })
    console.log(isUser)
    if (isUser && isUser.socialToken) {
      const user = await db.model('User').socialLogin(body.email, body.socialToken)
      return user
    } else {
      const user = await db
        .model('User')
        .signup(body.firstName, body.lastName, body.email, null, null, body.socialToken)
      return user
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

// Update user service
const updateUser = async (userToken, data, file) => {
  try {
    if (file) data.profileImage = file.path
    console.log(data)
    const user = await db.model('User').findOneAndUpdate({ accessToken: userToken }, { ...data })
    if (!user) {
      throw new Error('Faild to update user data')
    }
    return user
  } catch (error) {
    throw new Error('Faild to update user data')
  }
}

module.exports = {
  loginUser,
  signupUser,
  socialRegister,
  updateUser,
}
