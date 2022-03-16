const { User, Thought, Reaction } = require('../models');
//same as before
const thoughtsC = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: ':D' })
        .select(':D')
        .then(ThoughtDataDB => res.json(ThoughtDataDB))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: ':D' })
        .select(':D')
        .then(ThoughtDataDB => {
            if (!ThoughtDataDB) {
                res.status(404).json({message: 'There was no thought found'});
                return;
            }
            res.json(ThoughtDataDB);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createThought({ body }, res) {
        Thought.create(body)
        .then(ThoughtDataDB => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: ThoughtDataDB._id } },
                { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'There was no thought found' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
        .then(ThoughtDataDB => {
            if (!ThoughtDataDB) {
                res.status(404).json({ message: 'There was no thought found' });
                return;
            }
            res.json(ThoughtDataDB);
        })
        .catch(err => res.status(400).json(err));
    },
    deleteThought({ params }, res) {

        Thought.findOneAndDelete({ _id: params.id })
        .then(ThoughtDataDB => {
            if (!ThoughtDataDB) {
                res.status(404).json({ message: 'There was no thought found'});
                return;
            }
            User.findOneAndUpdate(
                { username: ThoughtDataDB.username },
                { $pull: { thoughts: params.id } }
            )
            .then(() => {
                res.json({message: 'Has been deleted'});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(ThoughtDataDB => {
            if (!ThoughtDataDB) {
                res.status(404).json({ message: 'There was no thought found here' });
                return;
            }
            res.json(ThoughtDataDB);
        })
        .catch(err => res.status(500).json(err));
    },
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(ThoughtDataDB => {
            if (!ThoughtDataDB) {
                res.status(404).json({ message: 'There was no thought that was found' });
                return;
            }
            res.json({message: 'Has been deleted'});
        })
        .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtsC;