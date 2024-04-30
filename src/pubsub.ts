import { PeerId } from "@libp2p/interface";
import { PeerseyHelia } from "./types.js";

import EventEmitter from "events";

import TypedEventEmitter, { EventMap } from "typed-emitter";
import { GossipsubOpts } from "@chainsafe/libp2p-gossipsub";
type TypedEmitter<T extends EventMap> = TypedEventEmitter.default<T>;

export interface PubSubMessage {
  data: string;
}

export type PubSubMessageHandler = (data: PubSubMessage) => void;

export type PeerseyPubSubEvents = {
  [key: `topic:${string}`]: PubSubMessageHandler;
};

export const pubsub_opts: Partial<GossipsubOpts> = {
  allowPublishToZeroTopicPeers: true,
  doPX: true,
};

export class PeerseyPubSub {
  public emitter = new EventEmitter() as TypedEmitter<PeerseyPubSubEvents>;
  private helia: PeerseyHelia;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(helia: PeerseyHelia) {
    this.helia = helia;

    this.helia.libp2p.services.pubsub.addEventListener("message", (data) => {
      console.log("got message", data);
      this.emitter.emit(`topic:${data.detail.topic}`, {
        data: this.decoder.decode(data.detail.data),
      });
    });
  }

  send(topic: string, message: string) {
    return this.helia.libp2p.services.pubsub.publish(
      topic,
      this.encoder.encode(message)
    );
  }

  listen(topic: string, fn: PubSubMessageHandler, subscribe = true) {
    this.emitter.on(`topic:${topic}`, fn);
    subscribe && this.subscribe(topic);
  }

  private subscribe(topic: string) {
    this.helia.libp2p.services.pubsub.subscribe(topic);
  }

  peers(): PeerId[] {
    return this.helia.libp2p.services.pubsub.getPeers();
  }
}
