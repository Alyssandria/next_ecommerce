import { app } from "./app";
import { env } from "./config/env";

app.listen(env.local.LOCAL_SERVER_PORT, function() {
  console.log(`Server listening to port ${env.local.LOCAL_SERVER_PORT}`);
});
