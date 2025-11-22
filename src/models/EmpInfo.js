class EmpInfo {
  constructor(
    employeeName,
    nationalNumber,
    highestSalary,
    averageSalary,
    status,
    isActive
  ) {
    this.EmployeeName = employeeName;
    this.NationalNumber = nationalNumber;
    this.HighestSalary = highestSalary;
    this.AverageSalary = averageSalary;
    this.Status = status;
    this.IsActive = isActive;
    this.lastUpdated = null;
  }

  setLastUpdated() {
    this.lastUpdated = new Date().toISOString();
  }
}

export default EmpInfo;
