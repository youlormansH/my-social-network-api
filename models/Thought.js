const { Schema, model} = require('mongoose');
const { reactionSchema } = require('./Reactions');

// Schema to create a course model
const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    createsAt: {
      type: Date,
      default: Date.now(),
    },
    reactions: [ reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Thought = model('thought', thoughtsSchema);

module.exports = Thought;
