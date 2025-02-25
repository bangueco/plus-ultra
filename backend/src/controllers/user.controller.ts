import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import userService from "../services/user.service";
import { HttpStatusCode } from "../utils/http";
import { Role } from "@prisma/client";

const isEmailVerified = async (request: Request, response: Response, next: NextFunction) => {

  const username = request.query.username

  try {
    if (!username) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Username is not specified!")

    const user = await userService.findByUsername(String(username))

    if (!user) throw new ApiError(HttpStatusCode.NOT_FOUND, "User not found.")

    if (user.isEmailValid) return response.status(HttpStatusCode.OK).json({verified: true})
    if (!user.isEmailValid) return response.status(HttpStatusCode.OK).json({verified: false})
  } catch (error) {
    return next(error)
  }
}

const verifyEmail = async (request: Request, response: Response, next: NextFunction) => {

  const emailToken = request.query.emailToken
  const username = request.query.username

  try {
    if (!username) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Invalid username!")
    if (!emailToken) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Invalid email token verification!")

    const user = await userService.findByUsername(String(username))

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Username not found!")

      if (user.emailToken === String(emailToken)) {
        await userService.updateUser(user.id, { isEmailValid: true });
        return response
          .status(HttpStatusCode.OK)
          .send(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                  }
                  .container {
                    background: #ffffff;
                    padding: 20px 30px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    text-align: center;
                    max-width: 400px;
                    margin: auto;
                  }
                  h1 {
                    color: #4CAF50;
                    font-size: 24px;
                  }
                  p {
                    color: #555555;
                    font-size: 16px;
                    margin-top: 10px;
                  }
                  a {
                    display: inline-block;
                    margin-top: 20px;
                    text-decoration: none;
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-weight: bold;
                  }
                  a:hover {
                    background-color: #45a049;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Email Verified Successfully!</h1>
                  <p>Your email address has been successfully verified.</p>
                  <p>Return to application</p>
                </div>
              </body>
            </html>
          `);
      } else {
        return response
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "Invalid email verification token." });
      }

  } catch (error) {
    return next(error)
  }
}

const getTrainers = async (_request: Request, response: Response, next: NextFunction) => {
  try {
    const trainers = await userService.findAllTrainer()
    return response.status(HttpStatusCode.OK).json(trainers)
  } catch (error) {
    return next(error)
  }
}

const findUser = async (request: Request, response: Response, next: NextFunction) => {

  const userId = request.query.userId

  try {
    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")
    
    const user = await userService.findById(Number(userId))

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    return response.status(HttpStatusCode.OK).json(user)
  } catch (error) {
    return next(error)
  }
}

const joinTrainer = async (request: Request, response: Response, next: NextFunction) => {

  const { userId, trainerId } = request.body

  try {

    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")
    if (!trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Trainer id is not specified!")

    const trainer = await userService.findById(trainerId)
    const user = await userService.findById(userId)

    if (!trainer) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Trainer not found!")
    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    if (user.trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "You already have a trainer!")
    if (user.role === Role.TRAINER) throw new ApiError(HttpStatusCode.BAD_REQUEST, "You are a trainer and you cant join another trainer!")
    if (trainer.role === Role.USER) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Trainer id does not have a trainer role!")

    const assignTrainerToUser = await userService.setTrainerId(userId, trainerId)

    return response.status(HttpStatusCode.OK).json({id: assignTrainerToUser.id, username: assignTrainerToUser.username, role: assignTrainerToUser.role, trainerId: assignTrainerToUser.trainerId})
  } catch (error) {
    return next(error)
  }
}

const leaveTrainer = async (request: Request, response: Response, next: NextFunction) => {

  const { userId } = request.body

  try {

    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")

    const user = await userService.findById(userId)

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    if (!user.trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "You are not assigned to any trainer!")

    await userService.setApprovedById(userId, false)
    const removeTrainerToUser = await userService.setTrainerId(userId, null)

    return response.status(HttpStatusCode.OK).json({id: removeTrainerToUser.id, username: removeTrainerToUser.username, role: removeTrainerToUser.role, trainerId: removeTrainerToUser.trainerId})
  } catch (error) {
    return next(error)
  }

}

const approveClient = async (request: Request, response: Response, next: NextFunction) => {

  const { userId } = request.body

  try {

    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")

    const user = await userService.findById(userId)

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    if (!user.trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "This user is not assigned to any trainer!")

    await userService.setApprovedById(userId, true)

    return response.status(HttpStatusCode.OK).json({message: "Approved client success!"})
  } catch (error) {
    return next(error)
  }
}

const cancelClient = async (request: Request, response: Response, next: NextFunction) => {

  const { userId } = request.body

  try {

    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")

    const user = await userService.findById(userId)

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    if (!user.trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "This user is not assigned to any trainer!")

    await userService.setTrainerId(userId, null)
    await userService.setApprovedById(userId, false)

    return response.status(HttpStatusCode.OK).json({message: "Approved client success!"})
  } catch (error) {
    return next(error)
  }
}

export default {
  isEmailVerified, verifyEmail, getTrainers, findUser, joinTrainer, leaveTrainer, approveClient, cancelClient
}