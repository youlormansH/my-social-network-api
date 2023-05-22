const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfUsers = await User.aggregate()
    .count('userCount');
  return numberOfUsers;
}

// Aggregate function for getting the overall grade using $avg
const grade = async (userId) =>
  User.aggregate([
    // only include the given student by using $match
    { $match: { _id: new ObjectId(userId) } },
    {
      $unwind: '$assignments',
    },
    {
      $group: {
        _id: new ObjectId(userId),
        overallGrade: { $avg: '$assignments.score' },
      },
    },
  ]);

module.exports = {
  // Get all students
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
        headCount: await headCount(),
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.usersId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No student with that ID' })
      }

      res.json({
        student,
        grade: await grade(req.params.userId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a student and remove them from the course
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such student exists' });
      }

      const thought = await Thought.findOneAndUpdate(
        { user: req.params.userId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({
          message: 'Student deleted, but no courses found',
        });
      }

      res.json({ message: 'Student successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addFriend(req, res) {
    console.log('You are adding an assignment');
    console.log(req.body);

    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!userData) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove assignment from a student
  async removeFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $pull:  { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!userData) {
        return res
          .status(404)
          .json({ message: 'No student found with that ID :(' });
      }

      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
