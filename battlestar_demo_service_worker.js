self.addEventListener('install', event => {
  console.log("msg from install event", event);
});

self.addEventListener('activate', event => {
  console.log("msg from activate event", event);
  this.clients.matchAll().then(clients => {
    console.log("all clients", clients);
    clients.forEach(client => {
      client.postMessage('hello from the other side');
    });
  });
});