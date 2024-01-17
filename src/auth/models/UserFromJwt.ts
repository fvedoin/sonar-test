export interface UserFromJwt {
  id: string;
  username: string;
  name: string;
  clientId: string;
  modules: string[];
  accessLevel: string;
}
