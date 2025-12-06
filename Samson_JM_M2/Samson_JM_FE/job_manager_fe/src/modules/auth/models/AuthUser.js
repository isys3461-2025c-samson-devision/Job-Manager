export default class AuthUser {
  constructor(data) {
    this.email = data.email || null;
    this.companyName = data.companyName;
    this.subscription = data.subscription;
    this.token = data.token;
  }
}
