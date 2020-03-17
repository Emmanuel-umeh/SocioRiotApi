var passport = require("passport");
// var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GoogleStrategy = require("passport-token-google").Strategy;
const FacebookStrategy = require("passport-facebook-token") 
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const config = require("config");
// passport.serializeUser(function(user, done) {
//  done(null, user);
// });
// passport.deserializeUser(function(user, done) {
//  done(null, user);
// });
// passport.use( "googleToken",
//  new GoogleStrategy(
//   {
//    clientID: "776039723298-skttdr56sodobqtui7g30c5rervum7br.apps.googleusercontent.com",
//    clientSecret: "9crIcJlzbAr1XKizdLuQ0VWM",
//    callbackURL: "http://localhost:5200/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//       console.log('accessToken', accessToken)
//       console.log('refreshToken', refreshToken)
//       console.log('profile', profile)
//    var userData = {
//     email: profile.emails[0].value,
//     name: profile.displayName,
//     token: accessToken
//    };
//    done(null, userData);
//   }
//  )
// );

// Google Oauth

module.exports = {
 googleOauth : async(req,res,next) => {
    console.log( "req.user", req.user)
    await jwt.sign(
        { id: req.user._id },
        
        "jwtSecret",
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({

            token, 

            user: {
              user: req.user
            }
          });
        }
      );
}

// facebookOauth : async(req,res,next) => {
//     console.log( "req.user", req.user)
//     await jwt.sign(
//         { id: req.user._id },
        
//         config.get("jwtSecret"),
//         { expiresIn: 3600 },
//         (err, token) => {
//           if (err) throw err;
//           res.status(200).json({

//             token, 

//             user: {
//               user: req.user
//             }
//           });
//         }
//       );

// },


// discordOauth : async(req,res,next) => {
//   console.log( "req.user", req.user)
//   await jwt.sign(
//       { id: req.user._id },
//       // console.log("id", id)
      
//       config.get("jwtSecret"),
//       { expiresIn: 3600 },
//       (err, token) => {
//         if (err) throw err;
//         console.log("token", token)
//         res.status(200).json({

//           token, 

//           user: {
//             user: req.user
//           }
//         });
//         res.redirect(`http://pacfarms.herokuapp.com/sponsor/?token=${token}`);
//       }
//     );
  

// }
}
passport.use( 'googleToken', new GoogleStrategy({
    clientID : "483013763707-jm3aknuh39grrronsu81rtn5588c32m8.apps.googleusercontent.com",
    clientSecret : "wfNg8KeXGxtPP_LNDTDkYn30"
}, async (accessToken, refreshToken, profile, done) => {

    try {
        console.log("accessToken ", accessToken)
        console.log("refreshToken ", refreshToken)
        console.log("profile ", profile)
        // console.log( "This is the res status")
      console.log("profile ", profile)
        // Cheks wheteher the user exists in our db
        const existingUser = await User.findOne({
            "local.email" : profile.emails[0].value
        })
        if(existingUser){
            async(req,res)  =>{
                res.json({msg:"user exists on db"})
            }
            console.log("google user exists on our db")
            return done(null, existingUser)
        }
    
        // if new account
        console.log("i am creating new user")
        const newUser  = new User({
            method : 'google',
            local : {
                // id : profile.id,

                // email : profile.emails[0].value,
                email : profile.emails[0].value,
                // firstName : profile.name.givenName,
                // lastName : profile.name.familyName
    
            }
        })

        console.log("new user ", newUser)
    
        await newUser.save().catch(err =>console.log(err))

        done(null, newUser)
        
    } catch (error) {
        done(error,false, error.message)
    }




}))



// Facebook

// const FacebookStrategy = strategy.Strategy;

// dotenv.config();
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
    "facebookToken", new FacebookStrategy(
    {
      clientID: "2565308597081298",
      clientSecret: 'a5840adb1c6293bb2ad8817fbaac1514',
      // callbackURL: "https://pacfarms.herokuapp.com/auth/facebook/callback",
      profileFields: ["id","email", "name"]
    },
    async(accessToken, refreshToken, profile, done) => {
      
    try {
        console.log("accessToken ", accessToken)
        console.log("refreshToken ", refreshToken)
        console.log("profile ", profile)
        console.log( "This is the res status")
      
        // Cheks wheteher the user exists in our db
        const existingUser = await User.findOne({
            "facebook.id" : profile.id
        })
        if(existingUser){
            async(req,res)  =>{
                res.json({msg:"user exists on db"})
            }
            console.log("google user exists on our db")
            return done(null, existingUser)
        }
    
        // if new account
        console.log("creating new user")
        const newUser  = new User({
            method : 'facebook',
            facebook : {
                id : profile.id,
                // email : profile.emails[0].value,
                email : profile.emails[0].value,
                firstName : profile.name.givenName,
                lastName : profile.name.familyName
    
            }
        })
    
        await newUser.save()

        done(null, newUser)
        
    } catch (error) {
        done(error,false, error.message)
    }

    }
  )
);


// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/fail"
//   })
// );

// router.get("/fail", (req, res) => {
//   res.send("Failed attempt");
// });

// router.get("/", (req, res) => {
//   res.send("Success");
// });