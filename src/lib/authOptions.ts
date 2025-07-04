import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/mongooseConnection"
import User from "@/models/user"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 604800, // 7 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase()
        const user = await User.findOne({ email: credentials?.email })
        console.log("[From authOption]",user);
        if (!user) throw new Error("No user found")

        const isValid = await bcrypt.compare(credentials!.password, user.password)
        // console.log(isValid);
        if (!isValid) throw new Error("Invalid credentials")

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("User passed to JWT callback:", user)
        token.id = user.id
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
    console.log("Session[from authOptions]: ", session)
    console.log("Token[from authOptions]: ", token) 
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}
