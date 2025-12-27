const COMPANY_NAME_KEY = "companyName";

export const localStorageUtil = {
  setToken: (token) => localStorage.setItem("accessToken", token),
  getToken: () => localStorage.getItem("accessToken"),
  removeToken: () => localStorage.removeItem("accessToken"),

  setRole: (role) => localStorage.setItem("role", role),
  getRole: () => localStorage.getItem("role"),
  removeRole: () => localStorage.removeItem("role"),

  setCompanyName: (name) => localStorage.setItem(COMPANY_NAME_KEY, name),
  getCompanyName: () => localStorage.getItem(COMPANY_NAME_KEY),
  removeCompanyName: () => localStorage.removeItem(COMPANY_NAME_KEY),
};
