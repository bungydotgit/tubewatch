import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import {
  replicateWebRTC,
  getConnectionHandlerSimplePeer,
} from "rxdb/plugins/replication-webrtc";

const useReplication = (partyId: string, db) => {
  const { isLoading, user } = useUser();

  useEffect(() => {
    const startReplication = async () => {
      if (!db || !partyId || !isLoading || !user) return;

      try {
        const replicationPool = await replicateWebRTC({
          collection: db.parties,
          topic: partyId,
          connectionHandlerCreator: getConnectionHandlerSimplePeer({
            signalingServerUrl: "ws://localhost:8081",
          }),
          isPeerValid: async (peer) => true,
          pull: {},
          push: {},
        });

        const userReplicationPool = replicateWebRTC({
          collection: db.userProfiles,
          collectionHandlerCreator: getConnectionHandlerSimplePeer({
            signalingServerUrl: "ws://localhost:8081",
          }),
          topic: partyId,
          isPeerValid: (peer) => true,
        });
      } catch (error) {
        console.error("Replication failed:", error);
      }
    };
  }, []);
};
