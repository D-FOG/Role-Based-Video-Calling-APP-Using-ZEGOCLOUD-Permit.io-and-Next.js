import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/mongooseConnection"
import User from "@/models/user"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60, // 60 seconds = 1 minute
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials:", credentials)
        await connectToDatabase()

        const user = await User.findOne({ email: credentials?.email })
        if (!user) throw new Error("No user found")

        const isValid = await bcrypt.compare(credentials!.password, user.password)
        if (!isValid) throw new Error("Invalid credentials")

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}

// ✅ For Next.js App Router — required exports
export const POST = NextAuth(authOptions)
export const GET = NextAuth(authOptions)
