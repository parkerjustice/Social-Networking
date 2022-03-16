const router = require('express').Router();
const {
    getAllThoughts,
    deleteReaction,
    getThoughtById,
    createThought,
    addReaction,
    updateThought,
    deleteThought,
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

router.route('/:thoughtId/reactions/')
    .post(addReaction)
    .delete(deleteReaction)
    router
    .route('/:thoughtId/:reactionId')
    .delete(removeReaction)

module.exports = router;