console.log("Sync Worker registered");

onmessage = msg => {
  const func = msg.data.func;
  const event = msg.data.event;
  const data = msg.data.data;

  if (event == undefined) {
    console.error("[WORKER]: Error: Malformed message. Missing event type or function");
    return;
  }
  this.postMessage({event: msg.event});
};
