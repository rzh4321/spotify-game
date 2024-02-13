"use server";

export default async function getAccessToken() {
  return process.env.ACCESS_TOKEN;
}
