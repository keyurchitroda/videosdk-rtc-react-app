import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";
import { authToken, createMeeting } from "../API";

function Controls({
  roomAId,
  roomBId,
  setRoomBId,
  setMeetingId,
  activeRelays,
}) {
  const {
    leave,
    toggleMic,
    toggleWebcam,
    switchTo,
    requestMediaRelay,
    stopMediaRelay,
  } = useMeeting();

  const [kinds, setKinds] = useState({
    video: true,
    audio: true,
    share: false,
    share_audio: false,
  });

  const createDestination = async () => {
    try {
      const newRoom = await createMeeting({ token: undefined }); // no hard-coded id
      setRoomBId(newRoom);
      alert("Destination room created: " + newRoom);
    } catch (err) {
      console.error("createDestination error:", err);
      alert("Failed to create destination: " + (err?.message ?? err));
    }
  };

  const handleRequestRelay = async () => {
    if (!roomBId)
      return alert("Please create/select a destination room first.");
    const kindsArray = Object.keys(kinds).filter((k) => kinds[k]);

    try {
      await requestMediaRelay({
        destinationMeetingId: roomBId,
        kinds: kindsArray,
      });
      alert("Requested media relay to " + roomBId);
    } catch (err) {
      console.error("requestMediaRelay error:", err);
      alert("Failed to request media relay: " + (err?.message ?? err));
    }
  };

  const handleStopRelay = async () => {
    if (!roomBId) return alert("No destination room to stop relay for.");
    try {
      await stopMediaRelay(roomBId);
      alert("Requested stop for relay to " + roomBId);
    } catch (err) {
      console.error("stopMediaRelay error:", err);
      alert("Failed to stop media relay: " + (err?.message ?? err));
    }
  };

  const handleSwitchToRoom = async (targetMeetingId) => {
    if (!targetMeetingId)
      return alert("target meeting id missing for switchTo");
    try {
      await switchTo({ meetingId: targetMeetingId });
      setMeetingId(targetMeetingId);
    } catch (err) {
      console.error("switchTo error:", err);
      alert("switchTo failed: " + (err?.message ?? err));
    }
  };

  const handleSwitchTo = async (targetMeetingId) => {
    if (!targetMeetingId) {
      alert("Target meeting id not available");
      return;
    }

    try {
      await switchTo({ meetingId: targetMeetingId, token: authToken });
      setMeetingId(targetMeetingId);
    } catch (err) {
      console.error("switchTo error:", err);
      alert("Failed to switch: " + err?.message ?? err);
    }
  };

  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>

      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => {
            // if currently in room A, switch to B, else switch to A
            handleSwitchTo(roomBId);
          }}
        >
          Switch to Room B
        </button>
        <button
          onClick={() => {
            handleSwitchTo(roomAId);
          }}
        >
          Switch to Room A
        </button>
      </div>

      {/* destination room creation */}
      <div style={{ marginTop: 12 }}>
        <button onClick={createDestination}>Create Destination Room</button>{" "}
        <span>{roomBId ? <code>{roomBId}</code> : "No destination"}</span>
      </div>

      {/* relay kinds */}
      <div style={{ marginTop: 8 }}>
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={kinds.video}
            onChange={(e) =>
              setKinds((s) => ({ ...s, video: e.target.checked }))
            }
          />
          Video
        </label>

        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={kinds.audio}
            onChange={(e) =>
              setKinds((s) => ({ ...s, audio: e.target.checked }))
            }
          />
          Audio
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleRequestRelay}>
          Request Media Relay → Destination
        </button>{" "}
        <button onClick={handleStopRelay}>Stop Media Relay</button>
      </div>

      <div style={{ marginTop: 8 }}>
        <strong>Active relays:</strong>{" "}
        {activeRelays?.length ? activeRelays.join(", ") : "None"}
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => handleSwitchToRoom(roomBId)}>
          Switch to Destination
        </button>
      </div>
    </div>
  );
}

export default Controls;
