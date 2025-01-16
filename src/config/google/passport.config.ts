import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppConfig from '../app.config';
import BaseAuthService from '../../services/auth/base.auth.service';
import BaseUserService from '../../services/user/base.user.service';
import User from '../../models/user/baseUser.model';
import { guard } from '../../dependencies/dependencies';

const userDoc = guard;

class PassportConfig {
  authService: BaseAuthService;
  baseUserService: BaseUserService;

  constructor(
    baseAuthService: BaseAuthService,
    baseUserService: BaseUserService
  ) {
    this.authService = baseAuthService;
    this.baseUserService = baseUserService;
    this.initializeStrategies();
  }

  initializeStrategies() {
    // Talent Google OAuth Strategy
    passport.use(
      'google-talent',
      new GoogleStrategy(
        {
          clientID: AppConfig.GOOGLE.GOOGLE_CLIENT_ID as string,
          clientSecret: AppConfig.GOOGLE.GOOGLE_CLIENT_SECRET as string,
          callbackURL: `${AppConfig.server.baseURL}/talent/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const userData = await this.authService.findUserByGoogle(profile);

            if (!userData) {
              return done(null, false, {
                message: 'User not found',
                data: profile,
              });
            }
            // Parse user data into UserDoc format
            const user = userDoc.createUserDoc(userData);
            return done(null, user);
          } catch (err) {
            return done(err, undefined);
          }
        }
      )
    );

    // Client Google OAuth Strategy
    passport.use(
      'google-client',
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL: `${AppConfig.server.baseURL}/client/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const userData = await this.authService.findUserByGoogle(profile);

            if (!userData) {
              return done(null, false, {
                message: 'User not found',
                data: profile,
              });
            }
            // Parse user data into UserDoc format
            const user = userDoc.createUserDoc(userData);
            return done(null, user);
          } catch (err) {
            return done(err, undefined);
          }
        }
      )
    );
  }

  serializeUser() {
    passport.serializeUser((user, done) => {
      done(null, (user as any)._id);
    });
  }

  deserializeUser() {
    passport.deserializeUser(async (id: string, done) => {
      try {
        // Logic to deserialize based on user type (e.g., talent or client)
        const userData = await this.baseUserService.findById(User, id);
        // (await this.talentService.findOne(TalentModel, id)) ||
        // (await this.organisationService.findOne(OrganisationModel, id));

        const user = userDoc.createUserDoc(userData);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  initializePassport() {
    return passport.initialize();
  }

  initializeSession() {
    return passport.session();
  }
}

export default PassportConfig;
