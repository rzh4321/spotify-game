"use server";

export default async function getAccessToken(): Promise<string> {
  return process.env.ACCESS_TOKEN as string;
}
