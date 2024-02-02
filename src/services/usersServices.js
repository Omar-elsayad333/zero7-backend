const { db } = require('../config/db')
const { uploadeFileToFirebase } = require('../handlers/storageHandlers')
const {
  createAccesToken,
  createRefreshToken,
  getTokenExpDate,
} = require('../handlers/tokenHandlers')

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
    const user = await db.model('User').signup(body)

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
    console.log(error)

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
const updateUser = async (req) => {
  try {
    if (req.file) {
      const url = await uploadeFileToFirebase(req.file, 'users')

      const query = { _id: req.userData._id, 'media.name': req.file.fieldname }

      // Define the update operation
      const update = {
        ...req.body,
        $addToSet: {
          media: { name: req.file.fieldname, path: url },
        },
        $set: {
          'media.$[elem].path': url,
        },
      }

      // Set the arrayFilters option to match the specific element in the array
      const options = {
        new: true,
        upsert: true,
        runValidators: true,
        arrayFilters: [{ 'elem.name': req.file.fieldname }],
      }

      const user = await db.model('User').findOneAndUpdate(query, update, options)
      return user
    } else {
      const user = await db
        .model('User')
        .findOneAndUpdate({ _id: req.userData._id }, { ...req.body })
      return user
    }
  } catch (error) {
    console.log(error)
    throw new Error('Faild to update user data')
  }
}

module.exports = {
  loginUser,
  signupUser,
  socialRegister,
  updateUser,
}
