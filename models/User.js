const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema({

  method : {
    type : String,
    enum : ['local', 'google']
    
  },
  local: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    },
    companyName: {
      type: String
    },
    companyType: {
      type: String
    },
    industry: {
      industry1 : {
        type : String
      },
      industry2 : {
        type : String
      },
      industry3 : {
        type : String
      },
      industry4 : {
        type : String
      }, 
      industry5 : {
        type : String
      }
    },
    country: {
      type: String,
      lowercase: true,
      default: ""
    },

    date: {
      type: Date,
      default: Date.now
    }
  }
});
module.exports = User = mongoose.model("user", UserSchema);
