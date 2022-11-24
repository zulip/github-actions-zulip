// This is currently held in this repo as a testbed, but it should be migrated
// to the zulip-js repo for broader use and tagged in a version bump at some
// point soon.
declare module "zulip-js" {
  export type ClientConfiguration =
    | { zuliprc: string }
    | {
        realm: string;
        username: string;
        apiKey?: string;
      };

  export type ApiParameters = Record<string, any>;
  // This type can be narrowed once this file lives in zulip-js appropriately,
  // as Language Server Protocol is indicating hover-for-type support in that
  // repo on Response objects, including fields like json() and status.
  export type UntypedApiCall = (_: ApiParameters) => Promise<any>;

  export type Client = {
    messages: ClientMessages;
  };

  export type ClientMessages = {
    deleteById: UntypedApiCall;
    deleteReactionById: UntypedApiCall;
    flags: ClientMessagesFlags;
    getById: UntypedApiCall;
    getHistoryById: UntypedApiCall;
    render: UntypedApiCall;
    retrieve: UntypedApiCall;
    update: UntypedApiCall;

    send(_: {
      to: string | number | Array<string | number>;
      type: "private" | "stream";
      topic: string;
      content: string;
    }): Promise<any>;
  };

  export type ClientMessagesFlags = {
    add: UntypedApiCall;
    remove: UntypedApiCall;
  };

  async function zulipInit(arguments_: ClientConfiguration): Promise<Client>;
  export default zulipInit;
}
