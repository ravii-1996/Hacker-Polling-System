const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Ravii_1996:Qwerty%2397@cluster0-r98r8.mongodb.net/votingDB" , { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;
const conn = mongoose.connection;
conn.on('connected', () => {
  console.log('MongoDB connected')
});



// check db is connected or not..
conn.on('error', (err) => {
  if (err) {
    throw err;
  }
});

//Schema for Cnadidate (Hacker) who can partcipate in contest
var HackerSchema = new Schema({
  hacker_name: {
    type: String,
    required: true,
    unique: true
  },
  total_challange_solved: {
    type: Number,
    required: true
  },
  candidate_rating: {
    type: Number,
    required: true
  },
  vote: {
    type: Number,
    required: true
  },
  expert_in: {
    data_structure : Number,
      algorithms : Number,
      java : Number,
      python : Number,
      node :Number,
      angular : Number
  }
})


// Schema for the end user who can vote. There could be admin also on the basis of role
var UserSchema = new Schema({
  email : { type: String, required: true, unique: true},
  password: { type: String, required: true },
  eligible_for_vote : {type :Boolean, required :true} ,
  role: {
    type: String,
    default: 'user',
    enum: ["user", "admin"]
   }
  });

var Hacker = module.exports = mongoose.model('Hacker', HackerSchema);
var User = module.exports = mongoose.model('User', UserSchema);

// This scheduler first delete the all entries and the insert the entry when app run first time.
module.exports.Hackerscheduler = async function (data, callback) {
  await Hacker.deleteMany(callback);
  Hacker.insertMany(data, callback);
}

// This scheduler first delete the entry and the insert the entry when app run first time.
module.exports.Userscheduler = async function (data, callback) {
  await User.deleteMany(callback);
  User.insertMany(data, callback);
}

// Fetch all hacker entreies to show in main home page
module.exports.getHackers = async function (callback) {
  await Hacker.find({}, callback);
}

//query for increment vote
module.exports.updateVote = async function (candidate, callback) {
  await Hacker.update({_id  : candidate._id}, {$set: {vote: candidate.vote+1}},callback);
}

//  delete hacker profile only done by admin
module.exports.deleteHacker = async function (candidate, callback) {
  await Hacker.deleteOne({hacker_name  : candidate.hacker_name},callback);
}

//  update hacker profile only done by admin
module.exports.updateHacker = async function (candidate, callback) {
  await Hacker.update({_id  : candidate._id}, {$set: candidate},callback);
}

// create new hacker profile only done by admin
module.exports.addHacker = async function (candidate, callback) {
  await Hacker.create(candidate,callback);
}

