import prisma from "../../src/utils/lib/prismaClient"

const getUsersFromDB = async () => {
  const users = await prisma.user.findMany({})
  return users.map(user => user)
}

const deleteUsersFromDB = async () => {
  try {
    const result = await prisma.user.deleteMany({});
    return result;
  } catch (error) {
    console.error('Error deleting users:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
}

const userHelper = {
  getUsersFromDB,
  deleteUsersFromDB
}

export default userHelper