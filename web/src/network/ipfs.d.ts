declare module "ipfs" {
  export type PubsubHandler = (msg: {
    from: string;
    seqno: ArrayBuffer;
    data: ArrayBuffer;
    topicIDs: string[];
  }) => void;

  type IpfsOptions = {
    timeout: Number;
    signal: AbortSignal;
  };

  export type IpfsType = {
    stop: (options?: IpfsOptions) => Promise<void>;
    pubsub: {
      subscribe: (
        topic: string,
        handler: PubsubHandler,
        options?: IpfsOptions
      ) => Promise<void>;
      unsubscribe: (
        topic: string,
        handler: PubsubHandler,
        options?: IpfsOptions
      ) => Promise<void>;
      publish: (topic: string, data: ArrayBuffer | string) => Promise<void>;
      peers: (topic: string) => string[];
    };
    id: () => Promise<{ id: string }>;
  };

  const Ipfs: {
    create: (opt?: any) => Promise<IpfsType>;
  };
  export = Ipfs;
}
