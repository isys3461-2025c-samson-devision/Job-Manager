import stats from "../data/jobStats.json";

export const companyService = {
  getCompanyStats: () => Promise.resolve(stats),
};
