import { getInput, info, setFailed } from "@actions/core";
import { Err, Ok, Result } from "ts-results";
import { AsyncResultWrapper } from "ts-async-results";
import { type Client, default as zulipInit } from "zulip-js";

type DestinationDetails = PrivateDestination | StreamDestination;
type PrivateDestination = {
  kind: DestinationKind.Private;
  destination: Array<string | number>;
};
type StreamDestination = {
  kind: DestinationKind.Stream;
  destination: string | number;
  topic: string;
};

enum DestinationKind {
  Private = "private",
  Stream = "stream",
}

function assertExhaustiveSwitch(_: never): never {
  throw new Error("switch statement not exhaustive");
}

function allNumeric(candidate: string | string[]): boolean {
  const oneOrMoreNumbersOnly = /^\d+$/;
  return typeof candidate === "string"
    ? oneOrMoreNumbersOnly.test(candidate)
    : candidate.every((item: string) => oneOrMoreNumbersOnly.exec(item));
}

function getMandatoryInputFromJob(key: string): Result<string, string> {
  const candidate = getInput(key, { required: true });

  return candidate
    ? new Ok(candidate)
    : new Err(`input "${key}" must be provided and non-empty`);
}

function getDestinationKindInputFromJob(): Result<DestinationKind, string> {
  const validValues = Object.values(DestinationKind);
  const errorMessage = `input "type" must exist and be one of ${validValues.join(
    " ,"
  )}`;
  return getMandatoryInputFromJob("type")
    .mapErr(() => errorMessage)
    .andThen((input) => {
      return validValues.includes(input as any)
        ? new Ok(input as DestinationKind)
        : new Err(errorMessage);
    });
}

function getDestinationDetails(): Result<DestinationDetails, string> {
  return getDestinationKindInputFromJob()
    .andThen((destinationKind) => {
      return getMandatoryInputFromJob("to").map((destination) => {
        return { kind: destinationKind, destination };
      });
    })
    .andThen(parseDestinationDetails);
}

function parseDestinationDetails({
  kind,
  destination,
}: {
  kind: DestinationKind;
  destination: string;
}): Result<DestinationDetails, string> {
  switch (kind) {
    case DestinationKind.Private: {
      return new Ok({
        kind,
        destination: parsePrivateMessageDestinations(destination),
      });
    }

    case DestinationKind.Stream: {
      return getMandatoryInputFromJob("topic")
        .map((topic) => {
          return {
            kind,
            topic,
            destination: parseStreamDestination(destination),
          };
        })
        .mapErr(() => 'topic is mandatory when type is "stream"');
    }

    default: {
      assertExhaustiveSwitch(kind);
    }
  }
}

function parsePrivateMessageDestinations(
  input: string
): PrivateDestination["destination"] {
  const rawDestinations = input.split(",");
  return allNumeric(rawDestinations)
    ? rawDestinations.map((item: string) => Number.parseInt(item, 10))
    : rawDestinations;
}

function parseStreamDestination(
  input: string
): StreamDestination["destination"] {
  return allNumeric(input) ? Number.parseInt(input, 10) : input;
}

async function getZulipClient(): Promise<Result<Client, string>> {
  return new AsyncResultWrapper(
    Result.all(
      getMandatoryInputFromJob("api-key"),
      getMandatoryInputFromJob("email"),
      getMandatoryInputFromJob("organization-url")
    )
  )
    .flatMap(
      ([apiKey, username, realm]) =>
        new AsyncResultWrapper(
          Result.wrapAsync(async () =>
            zulipInit({
              apiKey,
              username,
              realm,
            })
          )
        )
    )
    .resolve();
}

async function postMessageFromJobInputs(): Promise<Result<string, string>> {
  const topic = getInput("topic", { required: false });
  return new AsyncResultWrapper(
    Result.all(
      getMandatoryInputFromJob("content"),
      getDestinationDetails(),
      await getZulipClient()
    )
  )
    .flatMap(([content, destination, client]) => {
      const parameters = {
        to: destination.destination,
        type: destination.kind,
        topic,
        content,
      };
      return new AsyncResultWrapper(
        Result.wrapAsync(async () => client.messages.send(parameters))
      );
    })
    .flatMap((response: any) => {
      return response.result === "success"
        ? new Ok(`Message successfully sent with id: ${response.id as string}`)
        : new Err(
            response.code
              ? `${response.code as number}: ${response.msg as string}`
              : response.msg
          );
    })
    .resolve();
}

postMessageFromJobInputs().then((result) => {
  if (result.ok) {
    info(result.val);
  } else {
    setFailed(result.val);
  }
});
