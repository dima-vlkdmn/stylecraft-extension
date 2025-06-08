interface RecordingResponse {
  ok: boolean;
  gifUrl?: string;
  error?: string;
}


if (!(window as any).__OFFSCREEN_INITIALIZED) {
  (window as any).__OFFSCREEN_INITIALIZED = true;

  console.log('[Offscreen] script loaded.');

  let captureStream: MediaStream | null = null
  let mediaRecorder: MediaRecorder | null = null
  let recordedBlobs: Blob[] = []
  let stopCallback: ((resp: RecordingResponse) => void) | null = null
  let isRecording = false

  function startRecorder(sendResponse: (r: RecordingResponse) => void) {
    if (!captureStream) {
      sendResponse({ ok: false, error: 'No stream available' })
      return
    }
    recordedBlobs = []
    try {
      mediaRecorder = new MediaRecorder(captureStream, {
        mimeType: 'video/webm; codecs=vp8',
        videoBitsPerSecond: 1_500_000,
      })
    } catch (e: any) {
      console.error('[Offscreen] MediaRecorder init failed:', e)
      sendResponse({ ok: false, error: e.message })
      return
    }

    mediaRecorder.ondataavailable = (evt: BlobEvent) => {
      if (evt.data && evt.data.size > 0) {
        recordedBlobs.push(evt.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedBlobs, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      console.log('[Offscreen] Recording stopped, URL:', url)
      stopCallback?.({ ok: true, gifUrl: url })
      stopCallback = null
      isRecording = false
      mediaRecorder = null
    }

    mediaRecorder.start(Math.floor(1000 / 60))
    isRecording = true
    console.log('[Offscreen] Recording started.')
    sendResponse({ ok: true })
  }

  function startRecording(sendResponse: (r: RecordingResponse) => void, crop?: DOMRect) {
    if (isRecording) {
      sendResponse({ ok: false, error: 'Already recording' })
      return
    }

    if (!captureStream) {
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
        .then(stream => {
          captureStream = stream
          startRecorder(sendResponse)
        })
        .catch(err => {
          console.error('[Offscreen] getDisplayMedia failed:', err)
          sendResponse({ ok: false, error: err.message || 'getDisplayMedia error' })
        })
    } else {
      startRecorder(sendResponse)
    }
  }

  function stopRecording(sendResponse: (r: RecordingResponse) => void) {
    if (!isRecording || !mediaRecorder) {
      sendResponse({ ok: false, error: 'No active recording' })
      return
    }
    stopCallback = sendResponse
    mediaRecorder.stop()
  }

  function pauseRecording(sendResponse: (r: RecordingResponse) => void) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      sendResponse({ ok: true })
    } else {
      sendResponse({ ok: false, error: 'Cannot pause' })
    }
  }

  function resumeRecording(sendResponse: (r: RecordingResponse) => void) {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      sendResponse({ ok: true })
    } else {
      sendResponse({ ok: false, error: 'Cannot resume' })
    }
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.target !== 'offscreen') return false
    switch (msg.action) {
      case 'startRecording':
        console.log('[Offscreen] Received startRecording')
        startRecording(sendResponse, msg.data?.crop)
        return true
      case 'stopRecording':
        console.log('[Offscreen] Received stopRecording')
        stopRecording(sendResponse)
        return true
      case 'pauseRecording':
        console.log('[Offscreen] Received pauseRecording')
        pauseRecording(sendResponse)
        return true
      case 'resumeRecording':
        console.log('[Offscreen] Received resumeRecording')
        resumeRecording(sendResponse)
        return true
      default:
        sendResponse({ ok: false, error: 'Unknown action' })
        return false
    }
  })
}