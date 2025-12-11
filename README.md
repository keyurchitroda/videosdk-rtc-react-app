1. Project Setup

---

Clone the repo
git clone <your-repo-url>
cd <project-folder>

Install dependencies
npm install

Add your VideoSDK Token

Open src/API.js and replace the placeholder token with your own VideoSDK token.

Start the app
npm start
http://localhost:3000

2. Description of how room switching is implemented

---

Normal switching uses VideoSDK’s:

switchTo({ meetingId, token })

When the user clicks “Switch to Destination”:
The SDK disconnects them from Room A.
The SDK connects them to Room B.
Their camera and microphone turn on again in Room B.
The app updates the UI to show the new meeting ID.
Use case: When you want the participant to fully move into another room.

3. Explanation of Media Relay usage in this context

---

Media Relay lets a host send their video/audio from Room A → Room B without leaving Room A.

    Flow:
    Source room clicks Request Media Relay.
    Destination room receives a request pop-up.
    If destination accepts, it starts receiving the source’s camera/mic stream.
    Source stays in Room A, but viewers in Room B see/hear them.

    Use case:
    Cross-room conversations
    Broadcasting one host to many rooms

4. Notes & Limitations

---

switchTo() may cause a brief audio/video gap while reconnecting.
Media Relay requires acceptance from the destination room.'

Difference Between Normal Switch and Media Relay

    Normal Room Switching:
     - The user actually leaves Room A and joins Room B.
     - Their audio and video stop briefly during the handover.
     - Media is visible only in the room they join.
    Media Relay Switching:
     - The user stays in Room A, but their audio/video is sent to Room B.
     - There is no interruption in their media.
     - Their video/audio becomes visible in both rooms at the same time.
