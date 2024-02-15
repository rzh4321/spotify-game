import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
import SpotifyProvider from "next-auth/providers/spotify";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  // pages: {
  //   signIn: '/',
  //   signOut: '/',
  // },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as any,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as any,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email+user-read-private+playlist-read-private+user-top-read+user-follow-read+playlist-read-collaborative",
    }),
    //   CredentialsProvider({
    //     name: "credentials",
    //     credentials: {
    //       username: { label: "username", type: "text", placeholder: "username" },
    //       password: { label: "password", type: "password" },
    //     },
    //     // this will be called when we sign in with normal credentials
    //     async authorize(credentials) {
    //       const validatedFields = LoginSchema.safeParse(credentials);

    //       if (validatedFields.success) {
    //         await connectToDB();

    //         // authenticate the user
    //         const { username, password } = validatedFields.data;
    //         const regex = new RegExp(username, "i");
    //         const user = await User.findOne({ username: { $regex: regex } });
    //         if (!user) {
    //           throw new Error("Username does not exist");
    //         }
    //         const match = await bcrypt.compare(password, user.password);

    //         if (!match) {
    //           // passwords do not match
    //           throw new Error('Passwords not matching');
    //         }
    //         return user;
    //       }
    //       return null;

    //     },
    //   }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: any): Promise<any> {
      // Google login: finding an existing account or creating a new account
      // in the database with the provided name, username and profilePicUrl provided by google
      if (account.provider === "spotify") {
        // user object has details from google account, use those details to retrieve or create user object
        // in api call later
        const credentials = {
          name: user.name,
          username: user.email,
          profilePicUrl: user.image,
        };
        //   console.log('in signin(). u signed in with spotify. user is ', user);
        // check if user with this google acc exists. Otherwise create new user based off google acc
        // attach database user id to user.id
        return true;
      } else if (account.provider === "credentials") {
        // we already have all the necessary data from authorize(), just return true
        return true;
      }
    },
    // transfer user data to token object
    // dont transfer anything that could be changed once the user has logged in
    async jwt({ token, user, account }: any) {
      if (account?.provider === "spotify") {
        // console.log(
        //   "in jwt(). u signed in with spotify. token is ",
        //   token,
        //   " user is ",
        //   user,
        //   " account is ",
        //   account,
        // );
        token.accessToken = account.access_token;
        token.id = user.id;
      } else if (account?.provider === "credentials") {
        token.userId = user._id;
        token.username = user.username;
      }
      return token;
    },
    // transfer token data to session object
    async session({ session, token }: any) {
      // session.user.userId = token.userId;
      // session.user.username = token.username;
      // session only stores userId and username
      session.user.id = token.id;
      session.user.accessToken = token.accessToken;
      // console.log('in session(). sessio is ', session);
      return session;
    },
  },
};

export default authOptions;
