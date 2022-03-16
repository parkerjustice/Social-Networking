const useexpress = require('express');
const usemongoose = require('mongoose');

const app = useexpress();
const PORT = process.env.PORT || 3001;

app.use(useexpress.json());
app.use(useexpress.urlencoded({ extended: true }));
app.use(require('./routes'));

usemongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-media-api', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
usemongoose.set('debug', true);

app.listen(PORT, () => console.log(`Connected:${PORT}`));