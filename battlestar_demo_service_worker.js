self.addEventListener('install', event => {
  console.log("msg from Client", event);
  this.clients.matchAll().then(clients => {
    console.log("a client", clients);
    clients.forEach(client => client.postMessage('hello from the other side'));
  });
});