import { createRxDatabase } from "rxdb/plugins/core";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";

const create_ = async () => {
  const db = await createRxDatabase({
    name: "heroesdb", // <- name
    storage: getRxStorageLocalstorage(), // <- RxStorage

    /* Optional parameters: */
    password: "myPassword", // <- password (optional)
    multiInstance: true, // <- multiInstance (optional, default: true)
    eventReduce: true, // <- eventReduce (optional, default: false)
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
  });
};
