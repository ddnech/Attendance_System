const path = require("path");
module.exports = {
  convertFromDBtoRealPath(dbvalue) {
    return `${process.env.BASE_PATH}${dbvalue}`;
  },
  setFromFileNameToDBValueProfile(filename) {
    return `/src/Public/profile/${filename}`;
  },
  setFromFileNameToDBValueProduct(filename) {
    return `/src/Public/product/${filename}`;
  },
  getFileNameFromDbValue(dbValue) {
    if (!dbValue || dbValue === "") {
      return "";
    }
    const split = dbValue.split("/");
    if (split.length < 5) {
      return "";
    }
    return split[4];
  },
  getAbsolutePathPublicFileProfile(filename) {
    return path.join(__dirname, ".." , "Public", "profile", filename);
  },
  getAbsolutePathPublicFileProduct(filename) {
    return path.join(__dirname, ".." , "Public", "product", filename);
  },
};