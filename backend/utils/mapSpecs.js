module.exports = function mapSpecsToObject(specs) {
  const obj = {};
  for (const s of specs) {
    if (!s.attribute) continue;
    const key = s.attribute
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/-/g, "_");
    obj[key] = s.value;
  }
  return obj;
};
