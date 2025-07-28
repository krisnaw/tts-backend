import { serve } from '@hono/node-server'

import app from "@/app";

// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:3000`);

serve({
  fetch: app.fetch,
  port: 3000
});