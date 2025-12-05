import stats from "../data/companyStats.json";

export const companyService = {
  getCompanyStats: () => Promise.resolve(stats),
};
