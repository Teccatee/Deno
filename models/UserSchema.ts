interface UserSchema {
    id: string;
    name: string;
    email: string;
    password: string;
    save(): void;
  }