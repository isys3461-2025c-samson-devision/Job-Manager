export default class AuthUser {
  constructor(accessToken, role, companyName) {
    this.accessToken = accessToken;
    this.role = role;
    this.companyName = companyName;
  }
}
