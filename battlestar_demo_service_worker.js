self.addEventListener('install', event => {
  console.log("msg from install event", event);
  
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;
    console.log("we have access to the client");

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;
    console.log("there's a client to retrieve");

    // Send a message to the client.
    client.postMessage({
      msg: "Hey I just got a fetch from you!",
      url: event.request.url
    });
   
  }());
});

self.addEventListener('message', event => {
  console.log("received msg from client", event.data);
  event.ports[0].postMessage('private msg back');
});