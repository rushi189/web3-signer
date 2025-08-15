import { env } from './config/env';
import { createApp } from './app';

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT}`);
});
