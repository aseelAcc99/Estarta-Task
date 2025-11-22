import { getUserByNationalNumber, getSalariesByUserID } from "./DataAccess.js";
import EmpInfo from "../models/EmpInfo.js";
import { salaryAvgThreshold, statusLabels } from "../config/statusConfig.js";
import { getCache, setCache } from "../utils/Cache.js";

export const getStatus = async (nationalNumber) => {
  const cacheKey = `user:${nationalNumber}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const user = await getUserByNationalNumber(nationalNumber);

  if (!user) {
    return {
      error: "Invalid National Number",
      code: 404,
    };
  }

  if (!user.isactive) {
    return {
      error: "User is not Active",
      code: 406,
    };
  }

  const salaries = await getSalariesByUserID(user.id);
  if (salaries.length < 3) {
    return {
      error: "INSUFFICIENT_DATA",
      code: 422,
    };
  }

  adjustSalaries(salaries);
  const empInfo = getEmpInfo(user, nationalNumber, salaries);
  setCache(cacheKey, empInfo, 60);
  return empInfo;
};

const adjustSalaries = (salaries) => {
  salaries.forEach((s) => {
    let salary = parseFloat(s.salary);
    if (s.month == 12) {
      salary += salary * 0.1;
    } else if (s.month == 6 || s.month == 7 || s.month == 8) {
      salary -= salary * 0.05;
    }
    s.salary = salary;
  });
};

const calculateSum = (salaries) => {
  let yearTotal = {};
  salaries.forEach((s) => {
    let salary = parseFloat(s.salary);
    if (yearTotal[s.year]) {
      yearTotal[s.year] += salary;
    } else {
      yearTotal[s.year] = salary;
    }
  });

  let sum = 0;
  Object.keys(yearTotal).map((year) => {
    let total = yearTotal[year];
    if (total > 10000) total -= total * 0.07;
    sum += total;
  });
  return sum;
};

const calculateStatus = (avg) => {
  if (avg > salaryAvgThreshold) return statusLabels.BiggerThan;
  if (avg == salaryAvgThreshold) return statusLabels.Equal;
  return statusLabels.lessThan;
};

const getEmpInfo = (user, nationalNumber, salaries) => {
  let sum = calculateSum(salaries);
  let avg = parseFloat((sum / salaries.length).toFixed(2));
  let status = calculateStatus(avg);
  let highest = calculateHighest(salaries);

  let empInfo = new EmpInfo(
    user.username,
    nationalNumber,
    highest,
    avg,
    status,
    user.isactive
  );

  empInfo.setLastUpdated();
  return empInfo;
};

const calculateHighest = (salaries) => {
  return parseFloat(Math.max(...salaries.map((s) => s.salary)).toFixed(2));
};
