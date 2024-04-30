import { Libp2p } from "libp2p";

import { GossipSub } from "@chainsafe/libp2p-gossipsub";
import { HeliaLibp2p, DefaultLibp2pServices } from "helia";

export interface CustomServices extends DefaultLibp2pServices {
  pubsub: GossipSub;
}

export type PeerseyHelia = HeliaLibp2p<Libp2p<CustomServices>>;
