const app = require('./config/app');
const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, (req, res) => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});