import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface CustomSession extends Session {
  user: {
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
    // ...add more providers here
  ],

  callbacks: {
    async session({ session, token }: { session: Session; token: JWT; user?: User }): Promise<CustomSession> {
      const customSession = session as CustomSession;
      if (customSession.user?.name) {
        customSession.user.username = customSession.user.name
          .split(" ")
          .join("")
          .toLowerCase();
      }
      customSession.user.uid = token.sub;
      return customSession;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
