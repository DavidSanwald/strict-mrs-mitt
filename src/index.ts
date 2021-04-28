type EventMap = Record<string, any>;
type NonVoidKeys<T extends EventMap> = {
  [K in keyof T]: T[K] extends (arg: void) => void ? never : K;
}[keyof T];
type Unpacked<T> = T extends (infer U)[] ? U : T;

type Handlers<T> = { [K in keyof T]: T[K][] };
class StrictMrsMitt<T extends EventMap> {
  private handlers: Handlers<T>;
  private onceHandlers: Handlers<T>;
  constructor() {
    this.handlers = {} as Handlers<T>;
    this.onceHandlers = {} as Handlers<T>;
  }

  emit<K extends keyof T>(
    eventKey: K,
    ...fnArgs: K extends NonVoidKeys<T> ? Parameters<T[K]> : never
  ): void {
    if (eventKey in this.onceHandlers) {
      this.onceHandlers[eventKey].forEach(listeningHandler => {
        if (listeningHandler) {
          listeningHandler(...fnArgs);
          this.off(eventKey, listeningHandler);
        }
      });
    }

    if (eventKey in this.handlers) {
      this.handlers[eventKey].forEach(listeningHandler => {
        if (listeningHandler) {
          listeningHandler(...fnArgs);
        }
      });
    }
  }

  on<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>): void {
    if (!(eventKey in this.handlers)) {
      this.handlers[eventKey] = [];
    }
    if (Array.isArray(this.handlers[eventKey])) {
      this.handlers[eventKey].push(handler);
    }
  }
  once<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>): void {
    if (!(eventKey in this.onceHandlers)) {
      this.onceHandlers[eventKey] = [];
    }
    if (Array.isArray(this.onceHandlers[eventKey])) {
      this.onceHandlers[eventKey].push(handler);
    }
  }
  off<K extends keyof T>(eventKey: K, handler: Unpacked<T[K]>) {
    if (eventKey in this.handlers) {
      this.handlers[eventKey] = this.handlers[eventKey].filter(
        listeningHandler => listeningHandler !== handler
      );
    }
    if (eventKey in this.onceHandlers) {
      this.onceHandlers[eventKey] = this.onceHandlers[eventKey].filter(
        listeningHandler => listeningHandler !== handler
      );
    }
  }
}
export { StrictMrsMitt };
