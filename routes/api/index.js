const routers = require('express').Routers();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

routers.use('/users', userRoutes);
routers.use('/thoughts', thoughtRoutes);

module.exports = routers;