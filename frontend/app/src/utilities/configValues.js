let config = {
  apiBase: process.env.API_BASE_URL,
  endToEndTesting: process.env.CYPRESS_TESTING,
  //bunch of default values here;
};

// export function updateConfigs(newConfig) {
//   //TODO validate configs as we define them
//   merge(config, newConfig);
//   return config;
// }

export default config;
