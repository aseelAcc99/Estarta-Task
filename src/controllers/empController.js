import { getStatus } from "../services/processStatus.js";
import {validateString} from "../utils/Validator.js";
import HttpError from "../utils/HttpError.js";

const getEmpStatus = async (req, res, next) => {
  try {
    const nationalNumber = req.body.NationalNumber;
    if (!validateString(nationalNumber)) {
      throw new HttpError("Invalid Input Format", 400);
    }
    const result = await getStatus(nationalNumber);
    if (result.error) {
      throw new HttpError(result.error, result.code);
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default getEmpStatus;
