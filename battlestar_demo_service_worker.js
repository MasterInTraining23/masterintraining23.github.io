addEventListener('initial', event => {
  console.log(event);
  event.data.ports[0].postMessage(cluster);
});