import NextAuth from "next-auth";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    uid?: string;
  };
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo',
    }),
  ],

  callbacks: {
    async session({ session, token }): Promise<CustomSession> {
      const customSession = session as CustomSession;
      customSession.user.id = token.sub || 'demo-user-123';
      if (customSession.user?.name) {
        customSession.user.username = customSession.user.name
          .split(" ")
          .join("")
          .toLowerCase();
      }
      customSession.user.uid = token.sub || 'demo-user-123';
      return customSession;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || 'demo-secret',
});
