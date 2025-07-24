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

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    }),
  ],

  callbacks: {
    async session({ session, token }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || 'demo-user-123',
          username: session.user?.name?.split(" ").join("").toLowerCase() || 'demo-user',
          uid: token.sub || 'demo-user-123'
        }
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-yemen-flix-2025",
  
  // السماح بالوصول للموقع بدون تسجيل دخول
  pages: {
    signIn: '/signin', // صفحة تسجيل دخول مخصصة
  },
};

export default NextAuth(authOptions);
