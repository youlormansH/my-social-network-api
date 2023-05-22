const { Schema, model } = require('mongoose');
const { User } = require('.');
// const assignmentSchema = require('./Assignment');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      max_length: 50,
    },
    email: {
      type: String,
      required: true,
      max_length: 50,
    },
    thoughts: [{
      type: Schema.Types.UserId,
      ref: 'Thought'
    }
  ],
    friends: [
      {
        type: Schema.Types, UserId,
        ref: 'User'
  }
]
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const User = model('user', userSchema);

module.exports = User;
