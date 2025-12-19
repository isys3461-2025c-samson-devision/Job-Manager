export default class SignupRequest {
  constructor({
    companyName,
    email,
    password,
    phoneCode,
    phoneNumber,
    country,
  }) {
    this.companyName = companyName;
    this.email = email;
    this.password = password;
    this.phoneNumber = `${phoneCode}${phoneNumber}`;
    this.country = country;
  }
}
