export default class User {
  private readonly id: string;
  private email: string;
  private password: string;

  constructor() {}

  get getId() {
    return this.id;
  }

  get getEmail() {
    return this.email;
  }

  set setEmail(email: string) {
    this.email = email;
  }

  get getPassword() {
    return this.password;
  }

  set setPassword(password: string) {
    this.password = password;
  }
}
