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
  console.log("salaries" + JSON.stringify(salaries));
  if (salaries.length < 3) {
    return {
      error: "INSUFFICIENT_DATA",
      code: 422,
    };
  }

  adjustSalaries(salaries);
  console.log("salaries AFTER" + JSON.stringify(salaries));
  const empInfo = getEmpInfo(user, nationalNumber, salaries);
  console.log("empInfo" + JSON.stringify(empInfo));
  setCache(cacheKey, empInfo, 60);
  return empInfo;
};

const adjustSalaries = (salaries) => {
  salaries.forEach((s) => {
    let salary = parseFloat(s.salary);
    if (s.month == 12) {
      salary += salary * 0.1;
    } else if (s.month == 7 || s.month == 8 || s.month == 9) {
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

  console.log("yearTotal" + JSON.stringify(yearTotal));
  let sum = 0;
  Object.keys(yearTotal).map((year) => {
    console.log("********");
    let total = yearTotal[year];
    console.log("total" + total);
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
  let avg = sum / salaries.length;
  let status = calculateStatus(avg);
  let highest = calculateHighest(salaries);

  console.log("sum" + sum);
  console.log("avg" + avg);
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
  return Math.max(...salaries.map((s) => s.salary));
};
