import { Request } from "express";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth2";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import * as CredentialRepository from "../src/repositories/Credential";
import * as UserRepository from "../src/repositories/User";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_API_KEY}`,
      clientSecret: `${process.env.GOOGLE_SECRET_KEY}`,
      callbackURL: `${
        process.env.APP === "dev"
          ? "http://127.0.0.1:5000"
          : "https://bgn-user-service.herokuapp.com"
      }/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) {
      try {
        const { email, given_name, family_name, picture } = profile._json;
        const credential = await CredentialRepository.getByEmail(email);
        let user: any;
        let onBoarding: boolean = true;
        if (credential) {
          user = await UserRepository.getByCredentialId(
            credential.dataValues.id
          );
          user = user.dataValues;
          user.email = email;
          onBoarding = false;
        } else {
          user = {
            email,
            firstName: given_name,
            lastName: family_name,
            imgUrl: picture,
          };
        }
        done(null, { user, onBoarding });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: `${process.env.FACEBOOK_API_KEY}`,
      clientSecret: `${process.env.FACEBOOK_SECRET_KEY}`,
      callbackURL: `${
        process.env.APP === "dev"
          ? "http://127.0.0.1:5000"
          : "https://bgn-user-service.herokuapp.com"
      }/api/auth/facebook/callback`,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: any
    ) {
      try {
        console.log("profile._json", profile._json);
        const { email, given_name, family_name, picture } = profile._json;
        const credential = await CredentialRepository.getByEmail(email);
        let user: any;
        let onBoarding: boolean = true;
        if (credential) {
          user = await UserRepository.getByCredentialId(
            credential.dataValues.id
          );
          user = user.dataValues;
          user.email = email;
          onBoarding = false;
        } else {
          user = {
            email,
            firstName: given_name,
            lastName: family_name,
            imgUrl: picture,
          };
        }
        done(null, { user, onBoarding });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
