const passport=require("passport")
const GoogleStrategy=require("passport-google-oauth20").Strategy
const User=require("../model/userSchema")
const mongoose = require("mongoose");



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try{
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();
        const emailVerified = profile.emails?.[0]?.verified !== false;

        if (!email || !emailVerified) {
          return done(null, false, { message: "Google email must be verified" });
        }

        const user= await User.findOne({email,isDeleted: { $ne: true }})
        if(user){
          if(user.googleId){
            return done(null,user)
          }else{
            user.googleId=profile.id
            user.avatar=profile.photos[0].value,
            user.providers.push("google")
            user.isVerified=true
            await user.save()
            return done(null,user)
          }
        }else{
          const newuser= await User.create({
          firstName:profile.name.givenName,
          lastName:profile.name.familyName,
          email,
          googleId:profile.id,
          avatar:profile.photos[0].value,
          isVerified:true,
          providers:["google"]
            })
          return done(null,newuser)
        }
      }catch(e){
        return done(e,null)
      }
    }
  )
);
