const { timeStamp } = require('console');
const { Schema, model} = require('mongoose');
const  reactionSchema = require('./Reaction');

// Schema to create a course model
const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength:1,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: timeStamp => dateFormat(timeStamp)
    },

    reactions:[reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);
thoughtsSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtsSchema);

module.exports = Thought;
