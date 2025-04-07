"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function createUser(
  username: string,
  name: string,
  spotifyUserId?: string, // Optional parameter
  password?: string, // Optional parameter
) {
  const loggedInWithSpotify = password === undefined;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findMany({
      where: {
        OR: [
          {
            username,
          },
        ],
      },
    });

    if (!loggedInWithSpotify && existingUser.length > 0) {
      console.log("this username or spotify id already exists");
      throw Error("This username is taken.")
    }
    if (loggedInWithSpotify && existingUser.length > 0) {
      console.log('returning user logging in with spotify');
      return existingUser[0].userId;
    }

    // Hash the password if it is provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create a new user since one doesn't exist with the given username
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        spotifyUserId, // If spotifyUserId is not provided, this will be set to null
        password: hashedPassword, // Save the hashed password, or null if password was not provided
      },
    });
    console.log("New user created:", newUser);
    return JSON.stringify({ ...newUser, password }); // return unhashed pw since we're gonna log in with it
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
