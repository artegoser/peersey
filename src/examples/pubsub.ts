import { Peersey } from "../lib.js";

async function main() {
  const peersey = new Peersey();
  await peersey.init();

  peersey.pubsub.listen("test-artegoser", (msg) => {
    console.log(`Got message: ${msg.data}`);
  });

  setInterval(() => {
    console.log(
      "Sending message...",
      peersey.pubsub.peers(),
      peersey.helia.libp2p
        .getPeers()
        .filter((peer) => peer.toString().startsWith("12"))
    );

    peersey.pubsub.send("test-artegoser", "test message");
  }, 1000);
}

main();
