import "./App.css";
import { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./API";
import JoinScreen from "./components/JoinScreen";
import MeetingView from "./components/MeetingView";

function App() {
  const [meetingId, setMeetingId] = useState(null);
  const [roomAId, setRoomAId] = useState(null);
  const [roomBId, setRoomBId] = useState(null);

  // Get a meeting id (or create)
  const getMeetingAndToken = async (id) => {
    const meeting = id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meeting);
  };

  // Create two rooms (Room A + Room B) and auto-select Room A
  const createTwoRooms = async () => {
    const a = await createMeeting({ token: authToken });
    const b = await createMeeting({ token: authToken });
    setRoomAId(a);
    setRoomBId(b);
    setMeetingId(a);
  };

  // When meeting left
  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
      }}
      token={authToken}
    >
      <MeetingView
        meetingId={meetingId}
        onMeetingLeave={onMeetingLeave}
        roomAId={roomAId}
        roomBId={roomBId}
        setRoomBId={setRoomBId}
        setMeetingId={setMeetingId}
      />
    </MeetingProvider>
  ) : (
    <div>
      <JoinScreen getMeetingAndToken={getMeetingAndToken} />
      <div style={{ marginTop: 20 }}>
        <button onClick={createTwoRooms}>
          Create Two Rooms (Room A & Room B)
        </button>
      </div>
    </div>
  );
}

export default App;
