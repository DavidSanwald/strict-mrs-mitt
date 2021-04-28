type EventMap = Record<string, any>;

type NonVoidKeys<T extends EventMap> = {
  [K in keyof T]: T[K] extends (arg: void) => void ? never : K;
}[keyof T];

type Unpacked<T> = T extends (infer U)[] ? U : T;

type Handlers<T> = { [K in keyof T]: T[K][] };

class StrictMrsMitt<T extends EventMap> {
    #handlers: Handlers<T>;
    #onceHandlers: Handlers<T>;

  constructor() {
    this.#handlers = {} as Handlers<T>;
    this.#onceHandlers = {} as Handlers<T>;
  }

  emit<K extends keyof T>(
    eventKey: K,
    ...fnArgs: K extends NonVoidKeys<T> ? Parameters<T[K]> : never
  ): void {
    if (
      eventKey in this.#onceHandlers &&
      this.#onceHandlers[eventKey].length > 0
    ) {
      this.#onceHandlers[eventKey].forEach(listeningHandler => {
        listeningHandler(...fnArgs);
        this.off(eventKey, listeningHandler);
      });
    }

    if (eventKey in this.#handlers && this.#handlers[eventKey].length > 0) {
      this.#handlers[eventKey].forEach(listeningHandler => {
        listeningHandler(...fnArgs);
      });
    }
  }

  on<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>): void {
    if (eventKey in this.#handlers) {
      this.#handlers[eventKey].push(handler);
      return;
    }
    this.#handlers[eventKey] = [handler];
  }
  once<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>): void {
    if (eventKey in this.#onceHandlers) {
      this.#onceHandlers[eventKey].push(handler);
      return;
    }
    this.#onceHandlers[eventKey] = [handler];
  }

  off<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>) {
    if (eventKey in this.#handlers) {
      this.#handlers[eventKey] = this.#handlers[eventKey].filter(
        listeningHandler => listeningHandler !== handler
      );
    }
    if (eventKey in this.#onceHandlers) {
      this.#onceHandlers[eventKey] = this.#onceHandlers[eventKey].filter(
        listeningHandler => listeningHandler !== handler
      );
    }
  }
}
export { StrictMrsMitt };
