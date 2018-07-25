const propToLabel = function propToLabel(val) {
  return val
    ? val
        .replace(/([A-Z])/g, ' $1') // uppercase the first character
        .replace(/^./, str => str.toUpperCase())
    : val;
};

export default propToLabel;
