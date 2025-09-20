import { partySchema, userSchema } from "@/db/schemas";
import { createContext, useState, useEffect, useContext } from "react";
import { createRxDatabase, type RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

interface DatabaseContextType {
  database: RxDatabase;
  initializing: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const useRxDb = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useRxDb must be used within an RxDbProvider");
  }

  return context;
};

interface Proptype {
  children: React.ReactNode;
}

export const RxDbProvider = ({ children }: Proptype) => {
  const [db, setDb] = useState<RxDatabase | null>(null);
  const [initializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database: RxDatabase = await createRxDatabase({
          name: "tubewatchdb",
          storage: getRxStorageDexie(),
          multiInstance: true,
        });

        await database.addCollections({
          parties: {
            schema: partySchema,
          },
          userProfiles: { schema: userSchema },
        });

        console.log("Database and collections created.");
        setDb(database);
      } catch (error) {
        console.error("Database initialization failed: ", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <DatabaseContext
      value={{ database: db, initializing } as DatabaseContextType}
    >
      {children}
    </DatabaseContext>
  );
};
