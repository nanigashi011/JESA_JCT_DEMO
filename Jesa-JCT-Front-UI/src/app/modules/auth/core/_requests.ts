import { UserModel } from "./_models";
import { jwtDecode } from "jwt-decode";


export async function getUserByToken(
  token: string
): Promise<{ data: UserModel }> {
  try {
    const decodedToken = jwtDecode<UserModel>(token);
    return { data: decodedToken };
  } catch (error) {
    throw new Error("Invalid token");
  }
}
