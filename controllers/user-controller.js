const { User, Thought } = require('../models');

const usersC = {
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(UserDataDB => res.json(UserDataDB))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate([
            { path: 'thoughts', select: ":D" },
            { path: 'friends', select: ":D" }
        ])
        .select(':D')
        .then(UserDataDB => {
            if (!UserDataDB) {
                res.status(404).json({message: 'There was no thought found'});
                return;
            }
            res.json(UserDataDB);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createUser({ body }, res) {
        User.create(body)
        .then(UserDataDB => res.json(UserDataDB))
        .catch(err => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(UserDataDB => {
            if (!UserDataDB) {
                res.status(404).json({ message: 'There was no thought found' });
                return;
            }
            res.json(UserDataDB);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(UserDataDB => {
            if (!UserDataDB) {
                res.status(404).json({ message: 'There was no thought found'});
                return;
            }
            User.updateMany(
                { _id : {$in: UserDataDB.friends } },
                { $pull: { friends: params.id } }
            )
            .then(() => {
                Thought.deleteMany({ username : UserDataDB.username })
                .then(() => {
                    res.json({message: "Has been deleted"});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },
    removetheFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(UserDataDB => {
            if (!UserDataDB) {
                res.status(404).json({ message: 'There was no user that was found' });
                return;
            }

            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(UserDataDB2 => {
                if(!UserDataDB2) {
                    res.status(404).json({ message: 'There was no use that was found' })
                    return;
                }
                res.json({message: 'Has been deleted'});
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },
    addFriend({ params }, res) {

        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(UserDataDB => {
            if (!UserDataDB) {
                res.status(404).json({ message: 'There was no user that was found' });
                return;
            }
    
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(UserDataDB2 => {
                if(!UserDataDB2) {
                    res.status(404).json({ message: 'There was no user that was found' })
                    return;
                }
                res.json(UserDataDB);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },
//most is the same just reorganized
}

module.exports = usersC;