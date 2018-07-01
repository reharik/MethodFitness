const propToLabel = function(val) {
  return val
    ? val
        .replace(/([A-Z])/g, ' $1') // uppercase the first character
        .replace(/^./, function(str) {
          return str.toUpperCase();
        })
    : val;
};

export default propToLabel;
