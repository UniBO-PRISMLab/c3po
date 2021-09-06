module.exports = (potentialJson) => {
  try {
    if (typeof potentialJson !== "object") JSON.parse(potentialJson);
    return true;
  } catch (err) {
    return false;
  }
};
