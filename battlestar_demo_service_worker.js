﻿self.addEventListener('install', event => {
  console.log("msg from Client", event);
  this.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage('hello from the other side'));
  });
});