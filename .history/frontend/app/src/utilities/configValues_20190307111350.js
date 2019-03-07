let config = {
  apiBase: process.env.API_BASE_URL || 'http://localhost:3666/',
  //bunch of default values here;
};

// export function updateConfigs(newConfig) {
//   //TODO validate configs as we define them
//   merge(config, newConfig);
//   return config;
// }
console.log("==================")
console.log(process.env.API_BASE_URL)
console.log("==================")

export default config;
