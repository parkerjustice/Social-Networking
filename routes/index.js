const routers = require('express').routers();
const apiRoutes = require('./api/');

routers.use('/api', apiRoutes);

routers.use((req, res) => {
    res.status(404).send('<h1>Error</h1>');
})

module.exports = routers;