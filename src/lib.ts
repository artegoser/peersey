import { createHelia, libp2pDefaults } from "helia";

import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { PeerseyHelia } from "./types.js";
import { pubsub_opts, PeerseyPubSub } from "./pubsub.js";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";

export class Peersey {
  public helia!: PeerseyHelia;
  public pubsub!: PeerseyPubSub;
  async init() {
    const libp2p_config = {
      ...libp2pDefaults(),
      services: { pubsub: gossipsub(pubsub_opts) },
    };

    libp2p_config.peerDiscovery?.push(pubsubPeerDiscovery());

    this.helia = (await createHelia({
      libp2p: libp2p_config,
    })) as PeerseyHelia;

    this.pubsub = new PeerseyPubSub(this.helia);
  }
}
