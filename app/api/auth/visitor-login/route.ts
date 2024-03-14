import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// function to generate random usernames
function generateRandomUsername() {
  const adjectives = ["happy", "lucky", "sunny", "clever", "bright", "vivid"];
  const nouns = ["cat", "dog", "rabbit", "bird", "tiger", "lion"];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  // Increase the range for the random number (e.g., 1 - 10000)
  const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1) + 1);

  return `${randomAdjective}_${randomNoun}_${randomNumber}`;
}

// saves visitor data into db and returns user object
export const POST = async (req: NextRequest) => {
  const { spotifyUserId } = await req.json();
  const username = generateRandomUsername();
  const hashedPassword = bcrypt.hashSync(username, 10);
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        name: username,
        spotifyUserId: spotifyUserId ?? null, // If spotifyUserId is not provided, this will be set to null
        password: hashedPassword,
      },
    });
    cookies().set("visitor", username, {
      maxAge: 31536000,
      secure: true,
      httpOnly: true,
    });
    const body = JSON.stringify({
      message: "logged in",
      user: newUser,
    });
    return new NextResponse(body);
  } catch (err) {
    console.log("error: ", err);
    throw new Error("cant hash password or create new user or something");
  }
};
