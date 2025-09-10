import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import https from "https";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_APIURL;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
        const url = `${baseUrl}/auth/login`;

        try {
          const { data: apiRes } = await axios.post(
            url,
            { username, password },
            { httpsAgent: agent }
          );
          if (apiRes && apiRes.access_token && apiRes.user) {
            const user = apiRes.user?._doc;
            return {
              id: user.id || user._id,
              name: user.username,
              email: user.personal_email,
              role: user.role?.title || "user",
              mobile: user.contactNo,
              access_token: apiRes.access_token,
              fullName: user.fullName || "",
            };
          }
          return null;
        } catch (err) {
          console.error("authorize error:", err?.response?.data || err.message);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/serverError",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "none",
  //       path: "/",
  //       secure: true,
  //       domain: ".digikase.com",
  //     },
  //   },
  // },
  callbacks: {
    async signIn(userDetail) {
      return Object.keys(userDetail).length > 0;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.mobile = user.mobile;
        token.accessToken = user.access_token;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.user.mobile = token.mobile;
      session.user.fullName = token.fullName;
      return session;
    },
  },
});

export { handler as GET, handler as POST };