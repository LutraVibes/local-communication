document.addEventListener('DOMContentLoaded', () => {
  const hostButton = document.getElementById('hostc');
  const joinButton = document.getElementById('joinc');
  const contentBox = document.getElementById('contentbox');
  const callBox = document.getElementById('callbox');
  const joinCallButton = document.getElementById('join');
  const callIdInput = document.getElementById('callid');
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const muteButton = document.getElementById('mute');
  const cameraButton = document.getElementById('camera');
  const callIdDisplay = document.getElementById('callIdDisplay');

  let localStream;
  let peer;
  let currentCall;

  const getUserMedia = (constraints) => {
    return navigator.mediaDevices.getUserMedia(constraints);
  };

  const initPeer = () => {
    peer = new Peer();

    peer.on('open', id => {
      console.log('My peer ID is:', id);
      callIdDisplay.textContent = `Call ID: ${id}`;
    });

    peer.on('call', call => {
      getUserMedia({ video: true, audio: true }).then(stream => {
        call.answer(stream);
        call.on('stream', remoteStream => {
          remoteVideo.srcObject = remoteStream;
        });
        currentCall = call;
        callBox.hidden = false;
      });
    });
  };

  hostButton.addEventListener('click', () => {
    getUserMedia({ video: true, audio: true }).then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      initPeer();
      callBox.hidden = false;
    });
  });

  joinButton.addEventListener('click', () => {
    contentBox.hidden = false;
  });

  joinCallButton.addEventListener('click', () => {
    const callId = callIdInput.value;
    if (callId) {
      getUserMedia({ video: true, audio: true }).then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
        const call = peer.call(callId, stream);
        call.on('stream', remoteStream => {
          remoteVideo.srcObject = remoteStream;
        });
        currentCall = call;
        callBox.hidden = false;
      });
    }
  });

  muteButton.addEventListener('click', () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    muteButton.textContent = localStream.getAudioTracks()[0].enabled ? 'Mute' : 'Unmute';
  });

  cameraButton.addEventListener('click', () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    cameraButton.textContent = localStream.getVideoTracks()[0].enabled ? 'Camera Off' : 'Camera On';
  });
});