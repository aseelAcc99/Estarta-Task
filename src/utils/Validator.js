export const validateString = (str) => {
  if (!str || typeof str !== "string") {
    return false;
  }
  return true;
};
