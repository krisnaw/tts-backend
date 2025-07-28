import {createRouter} from "@/lib/create-app";

import * as handlers from "./records.handlers";
import * as routes from "./records.routes";

const router = createRouter()
    .openapi(routes.listRecords, handlers.listRecords)
    .openapi(routes.create, handlers.createRecords)
    .openapi(routes.remove, handlers.removeRecords)

export default router;