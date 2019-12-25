const messageChannel = new MessageChannel();
messageChannel.port1.onmessage = event => { console.log('msg from SW', event); }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/battlestar_demo_service_worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      registration.active.postMessage("save channel for communication", [messageChannel.port2]);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}