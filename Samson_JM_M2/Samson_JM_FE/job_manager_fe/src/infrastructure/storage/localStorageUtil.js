export const localStorageUtil = {
  setToken: (token) => localStorage.setItem("accessToken", token),
  getToken: () => localStorage.getItem("accessToken"),
  removeToken: () => localStorage.removeItem("accessToken"),

  setRole: (role) => localStorage.setItem("role", role),
  getRole: () => localStorage.getItem("role"),
  removeRole: () => localStorage.removeItem("role"),
};
