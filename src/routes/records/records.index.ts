import {createRouter} from "@/lib/create-app";

import * as handlers from "./records.handlers";
import * as routes from "./records.routes";

const router = createRouter()
    .openapi(routes.listRecords, handlers.listRecords)
    .openapi(routes.createRecords, handlers.createRecords)

export default router;