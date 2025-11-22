import { validateUser } from "../services/DataAccess.js";
import { generateToken } from "../utils/jwt.js";
import HttpError from "../utils/HttpError.js";
import { validateString } from "../utils/Validator.js";

const getToken = async (req, res, next) => {
  try {
    const nationalNumber = req.body.NationalNumber;
    const username = req.body.Username;

    if (!username || !nationalNumber)
      throw new HttpError("Username and NationalNumber required", 400);

    if (!validateString(nationalNumber) || !validateString(username)) {
      throw new HttpError("Invalid Input Format", 400);
    }

    const user = await validateUser(username, nationalNumber);
    if (!user) throw new HttpError("Invalid Credentials", 400);

    const payload = {
      id: user.ID,
      username: username,
      nationalNumber: nationalNumber,
    };

    const token = generateToken(payload);
    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    console.log("error in token generation "+ error);
    next(err);
  }
};

export default getToken;
