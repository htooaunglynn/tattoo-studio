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
        role: { type: "text", label: "Role" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
        const password = String(credentials?.password ?? "")
        const role = String(credentials?.role ?? "")
        const user = await authenticateUserFromCookies(email, password, role)

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "")
        session.user.role = token.role === "admin" || token.role === "user" ? token.role : "user"
      }

      return session
    },
  },
})
