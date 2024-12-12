import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  email: string;
  password: string;
}

export const userService = {
  async register(email: string, password: string) {
    const users = await this.getUsers();
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      throw new Error("Cet email est déjà utilisé");
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
    };

    users.push(newUser);
    await AsyncStorage.setItem("users", JSON.stringify(users));
    return newUser;
  },

  async login(email: string, password: string) {
    const users = await this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    await AsyncStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  },

  async getUsers(): Promise<User[]> {
    const users = await AsyncStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  },
};
