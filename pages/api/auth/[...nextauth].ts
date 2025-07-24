import NextAuth from "next-auth/next";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface CustomSession extends Session {
  expires: string;
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      const customSession: CustomSession = {
        ...session,
        expires: session.expires,
        user: {
          id: token.sub || 'demo-user-123',
          name: session.user?.name || null,
          email: session.user?.email || null,
          image: session.user?.image || null,
          username: session.user?.name?.split(" ").join("").toLowerCase() || 'demo-user',
          uid: token.sub || 'demo-user-123'
        }
      };
      return customSession;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
});
