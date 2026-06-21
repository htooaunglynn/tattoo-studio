import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { authenticateUserFromCookies } from "@/lib/server-store"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "tattoo-studio-demo-secret",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email", label: "Email" },
        password: { type: "password", label: "Password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
        const password = String(credentials?.password ?? "")
        const user = await authenticateUserFromCookies(email, password)

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "")
      }

      return session
    },
  },
})
