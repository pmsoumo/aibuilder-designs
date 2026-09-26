(() => {
  const select = document.querySelector("#upload-stage");
  const leave = document.querySelector("[data-leave]");
  const title = document.querySelector("[data-status-title]");
  const message = document.querySelector("[data-status-message]");
  const next = document.querySelector("[data-status-next]");
  const fileState = document.querySelector("[data-file-state]");
  const label = document.querySelector("[data-draft-label]");
  const screenTitle = document.querySelector("[data-screen-title]");
  const hint = document.querySelector("[data-leave-hint]");
  const card = document.querySelector(".status-card");
  const states = {
    uploading: {
      file: "uploading",
      title: "Uploading your video",
      message:
        "Your memory and photo are saved. Keep this page open while the video transfers.",
      next: "If the transfer stops, we’ll let you know here.",
      hint: "Stay on this page until the transfer finishes.",
      tone: "attention",
    },
    checking: {
      file: "awaiting confirmation",
      title: "Checking your video",
      message:
        "The transfer finished, but our video service hasn’t confirmed the video yet. Your memory and photo are safe.",
      next: "You can leave this page. We’ll show the current status on your memory.",
      hint: "The video is not yet confirmed or playable.",
      tone: "neutral",
    },
    preparing: {
      file: "preparing",
      title: "Getting your video ready",
      message:
        "Your video has been confirmed and is being prepared for playback. Your memory and photo are already saved.",
      next: "You can leave this page and come back later.",
      hint: "The video will be playable when preparation finishes.",
      tone: "neutral",
    },
    ready: {
      file: "ready",
      title: "Your video is ready",
      message:
        "Your photo and video are together in this memory. Open it to watch both.",
      next: "People with your share link can now watch the video.",
      hint: "The video is playable.",
      tone: "neutral",
    },
    delayed: {
      file: "still unconfirmed",
      title: "Still checking your video",
      message:
        "We haven’t been able to confirm the video yet. Your memory and photo are saved; we don’t want to tell you the video is ready when we can’t verify it.",
      next: "Keep the original video file for now. You can return to this memory to check its status.",
      hint: "Only you see this status; a shared link shows the saved photo.",
      tone: "attention",
    },
    failed: {
      file: "could not prepare",
      title: "Your video couldn’t be prepared",
      message:
        "The video service reported a problem with this video. Your memory and photo are saved.",
      next: "Keep the original file. We’ll help you choose a safe way to try again without creating a duplicate.",
      hint: "A shared link shows the saved photo, not this failed video.",
      tone: "attention",
    },
  };
  let ownerMode = false;
  function render() {
    const state = states[select.value];
    const onOwnerView = ownerMode && select.value !== "uploading";
    document.body.classList.toggle("owner-mode", onOwnerView);
    screenTitle.textContent = onOwnerView ? "Saturday 4:58 PM" : "New memory";
    label.textContent = onOwnerView
      ? "Only you see this video status"
      : "Saving your memory";
    title.textContent = state.title;
    message.textContent = state.message;
    next.textContent = state.next;
    fileState.textContent = state.file;
    hint.textContent = state.hint;
    card.dataset.tone = state.tone;
    leave.disabled = select.value === "uploading";
    leave.textContent = onOwnerView
      ? "Return to capture view"
      : "See owner’s memory view";
  }
  select.addEventListener("change", () => {
    ownerMode = false;
    render();
  });
  leave.addEventListener("click", () => {
    ownerMode = !ownerMode;
    render();
  });
  render();
})();
