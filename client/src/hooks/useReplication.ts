import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const useReplication = (partyId, db) => {
  const { isLoading, user } = useUser();

  useEffect(() => {
    const startReplication = async () => {
      if (!db || !partyId || !isLoading || !user) return;

      try {
        replicateWebRTC;
      } catch (error) { }
    };
  });
};
