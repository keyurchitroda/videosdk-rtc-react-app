import { useMeeting } from "@videosdk.live/react-sdk";
import { useState, useCallback } from "react";
import ParticipantView from "./ParticipantView";
import Controls from "./Controls";

function MeetingView(props) {
  const [joined, setJoined] = useState(null);

  const [relayRequests, setRelayRequests] = useState([]);
  const [activeRelays, setActiveRelays] = useState([]);

  // Called on the destination meeting when someone requests relay into this meeting
  const onMediaRelayRequestReceived = useCallback(
    ({ participantId, meetingId, displayName, accept, reject }) => {
      // push request into queue
      setRelayRequests((prev) => [
        ...prev,
        { participantId, meetingId, displayName, accept, reject },
      ]);
    },
    []
  );

  // Called in the source meeting when destination accepts/rejects
  const onMediaRelayRequestResponse = useCallback(
    ({ decision, decidedBy, meetingId }) => {
      console.log("Relay request response:", {
        decision,
        decidedBy,
        meetingId,
      });
    },
    []
  );

  const onMediaRelayStarted = useCallback((payload) => {
    const meetingId =
      typeof payload === "string" ? payload : payload?.meetingId;
    if (!meetingId) return;
    setActiveRelays((s) => (s.includes(meetingId) ? s : [...s, meetingId]));
    console.log("Media relay started to:", meetingId);
  }, []);

  const onMediaRelayStopped = useCallback(({ meetingId, reason }) => {
    setActiveRelays((s) => s.filter((m) => m !== meetingId));
    console.log("Media relay stopped:", meetingId, reason);
  }, []);

  const onMediaRelayError = useCallback(({ meetingId, error }) => {
    console.error("Media relay error:", meetingId, error);
  }, []);

  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: () => props.onMeetingLeave(),
    onMediaRelayRequestReceived,
    onMediaRelayRequestResponse,
    onMediaRelayStarted,
    onMediaRelayStopped,
    onMediaRelayError,
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  // Accept / reject incoming request (destination side)
  const acceptRelayRequest = (req) => {
    if (!req || !req.accept) return;
    req.accept();
    setRelayRequests((s) => s.filter((r) => r !== req));
    setActiveRelays((s) =>
      s.includes(req.meetingId) ? s : [...s, req.meetingId]
    );
  };

  const rejectRelayRequest = (req) => {
    if (!req || !req.reject) return;
    req.reject();
    setRelayRequests((s) => s.filter((r) => r !== req));
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>

      <div style={{ marginBottom: 8 }}>
        <strong>Active Relays:</strong>{" "}
        {activeRelays.length ? activeRelays.join(", ") : "None"}
      </div>

      {joined && joined === "JOINED" ? (
        <div>
          <Controls
            roomAId={props.roomAId}
            roomBId={props.roomBId}
            setRoomBId={props.setRoomBId}
            setMeetingId={props.setMeetingId}
            activeRelays={activeRelays}
          />

          {/* Incoming relay requests (if any) - displayed only when this meeting receives a request */}
          {relayRequests.length > 0 && (
            <div
              style={{ marginTop: 12, padding: 10, border: "1px solid #ddd" }}
            >
              <h4>Incoming Media Relay Requests</h4>
              {relayRequests.map((req, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{req.displayName}</strong> wants to relay media to
                    this meeting <code>{req.meetingId}</code>
                  </div>
                  <button onClick={() => acceptRelayRequest(req)}>
                    Accept
                  </button>{" "}
                  <button onClick={() => rejectRelayRequest(req)}>
                    Reject
                  </button>
                </div>
              ))}
            </div>
          )}

          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}

export default MeetingView;
