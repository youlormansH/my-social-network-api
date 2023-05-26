const { Thought, User } = require('../models');

const thoughtController = {
  // Get all courses
  async getThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find()
      .sort({ createdAt: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // getThoughtById({ params }, res) {
  //   Thought.findOne({ _id: params.id })
  //     .then((dbThoughtData) => {
  //       if (!thoughtData) {
  //         res
  //           .status(404)
  //           .json({ message: "There is no thought with this ID" });
  //         return;
  //       }
  //       res.json(thoughtData);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(400).json(err);
  //     });
  // },
  // Get a course
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId })

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a course
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);
      res.json(dbThoughtData);
      //find user update
      // make a variable follow line 31
      const dbUserData = await User.findOneAndUpdate({ _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true });
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({message: "thought created"});

    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a course
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndRemove({ _id: req.params.thoughtId })

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      // remove thought id from user's `thoughts` field
      const dbUserData = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user with this id!' });
      }

      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },  // Update a course
  async updateThought(req, res) {
    try {
      const dbThoughtData = await thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No use found with that ID :(' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

};

module.exports = thoughtController