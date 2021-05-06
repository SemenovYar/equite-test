import app from './app';

const port = 3000;
const host = 'localhost';

app.listen(port, host, () => {
  console.log(`Server start on ${host}:${port}`);
});

process.on('unhandledRejection', (err) => {
  if (err) {
    console.error(err);
  }
});

process.on('rejectionHandled', (err) => {
  if (err) {
    console.error(err);
  }
});

process.on('uncaughtException', (err) => {
  if (err) {
    console.error(err);
  }
});
