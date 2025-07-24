// Session types for NextAuth
export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
  uid?: string;
}

export interface Session {
  user?: User;
  expires?: string;
}

export type SessionType = Session | null;