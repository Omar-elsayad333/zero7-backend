const { db } = require('../config/db')

const updateUser = async (userToken, data, file) => {
  try {
    data.profileImage = file.path
    const user = await db.model('User').findOneAndUpdate({ accessToken: userToken }, { data })
    return user
  } catch (error) {
    throw new Error('Faild to update user')
  }
}

module.exports = {
  updateUser,
}
