import { app } from "./app";
import { env } from "./config/env";



app.listen(env.SERVER_PORT, function() {
  console.log(env.APP_URL);
  console.log(`Server listening to port ${env.SERVER_PORT}`);
});
