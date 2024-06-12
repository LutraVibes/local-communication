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
      console.log('Receiving a call');
      getUserMedia({ video: true, audio: true }).then(stream => {
        call.answer(stream);
        call.on('stream', remoteStream => {
          remoteVideo.srcObject = remoteStream;
        });
        call.on('close', () => {
          console.log('Call ended');
        });
        currentCall = call;
        callBox.hidden = false;
      }).catch(err => {
        console.error('Failed to get local stream', err);
      });
    });

    peer.on('error', err => {
      console.error('Peer error', err);
    });
  };

  hostButton.addEventListener('click', () => {
    getUserMedia({ video: true, audio: true }).then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      initPeer();
      callBox.hidden = false;
    }).catch(err => {
      console.error('Failed to get local stream', err);
    });
  });

  joinButton.addEventListener('click', () => {
    contentBox.hidden = false;
  });

  joinCallButton.addEventListener('click', () => {
    const callId = callIdInput.value.trim();
    if (callId) {
      console.log(`Joining call with ID: ${callId}`);
      getUserMedia({ video: true, audio: true }).then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
        peer = new Peer();

        peer.on('open', () => {
          const call = peer.call(callId, stream);
          call.on('stream', remoteStream => {
            remoteVideo.srcObject = remoteStream;
          });
          call.on('close', () => {
            console.log('Call ended');
          });
          currentCall = call;
          callBox.hidden = false;
        });

        peer.on('error', err => {
          console.error('Peer error', err);
        });
      }).catch(err => {
        console.error('Failed to get local stream', err);
      });
    }
  });

  muteButton.addEventListener('click', () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      muteButton.textContent = audioTrack.enabled ? 'Mute' : 'Unmute';
    }
  });

  cameraButton.addEventListener('click', () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      cameraButton.textContent = videoTrack.enabled ? 'Camera Off' : 'Camera On';
    }
  });
});
