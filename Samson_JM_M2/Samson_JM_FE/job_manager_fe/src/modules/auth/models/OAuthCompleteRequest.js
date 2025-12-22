export class OAuthCompleteRequest {
  constructor({ email, companyName, country, phoneNumber }) {
    this.email = email;
    this.companyName = companyName;
    this.country = country;
    this.phoneNumber = phoneNumber;
  }
}

export default OAuthCompleteRequest;