import { StrictMrsMitt } from '../src';

type EventMap = {
  expectTwoStringArgs: (arg: string, arg2: string) => void;
  expectOneArg: (arg: number) => void;
  expectNoArgs: () => void;
};

describe('Initialization', () => {
  const emitter = new StrictMrsMitt<EventMap>();
  it('works', () => {
    expect(emitter).toBeInstanceOf(StrictMrsMitt);
  });
});

describe('Registering Permanent Listeners', () => {
  const emitter = new StrictMrsMitt<EventMap>();
  const mockCallback = jest.fn(() => {});
  emitter.on('expectNoArgs', mockCallback);

  it('calles registered listeners with no arguments, if none are passed ', () => {
    emitter.emit('expectNoArgs');
    expect(mockCallback).toHaveBeenCalledWith();
  });
});

describe('Adding and Removing Listeners', () => {
  const emitter = new StrictMrsMitt<EventMap>();
  const listenerA = jest.fn(() => {});
  const listenerB = jest.fn(() => {});
  const listenerC = jest.fn(() => {});
  emitter.on('expectNoArgs', listenerA);
  emitter.on('expectNoArgs', listenerB);
  emitter.on('expectNoArgs', listenerC);
  emitter.off('expectNoArgs', listenerC);
  emitter.emit('expectNoArgs');

  it('it does not call listeners that have been removed', () => {
    expect(listenerC).not.toHaveBeenCalled();
  });
  it('it still calls remaining listeners', () => {
    expect(listenerA).toHaveBeenCalled();
  });
});

describe('Once Listeners', () => {
  const emitter = new StrictMrsMitt<EventMap>();
  const listenerA = jest.fn(() => {});
  const listenerB = jest.fn(() => {});
  emitter.once('expectNoArgs', listenerA);
  emitter.on('expectNoArgs', listenerB);
  emitter.emit('expectNoArgs');

  it('it calls one time listeners', () => {
    expect(listenerA).toHaveBeenCalled();
  });
  it('it still calls other permanent listeners', () => {
    expect(listenerB).toHaveBeenCalled();
  });
  it('it does not call one time listenes again', () => {
    expect(listenerA).toHaveBeenCalledTimes(1);
  });
  it('it calls permanent listeners when an event repeats', () => {
    emitter.emit('expectNoArgs');
    expect(listenerB).toHaveBeenCalledTimes(2);
  });
});

describe('Passing Arguments to Listeners', () => {
  const emitter = new StrictMrsMitt<EventMap>();
  const listenerA = jest.fn(() => {});
  const listenerB = jest.fn(() => {});
  const listenerC = jest.fn(() => {});
  const listenerD = jest.fn(() => {});
  const listenerE = jest.fn(() => {});
  const listenerF = jest.fn(() => {});
  emitter.on('expectNoArgs', listenerA);
  emitter.once('expectNoArgs', listenerB);
  emitter.on('expectOneArg', listenerC);
  emitter.once('expectOneArg', listenerD);
  emitter.on('expectTwoStringArgs', listenerE);
  emitter.once('expectTwoStringArgs', listenerF);

  it('it does not pass arguments to listeners if they are none', () => {
    emitter.emit('expectNoArgs');
    expect(listenerA).toHaveBeenCalledWith();
    expect(listenerB).toHaveBeenCalledWith();
  });
  it('it passes a single argument correctly', () => {
    emitter.emit('expectOneArg', 666);
    expect(listenerC).toHaveBeenCalledWith(666);
    expect(listenerD).toHaveBeenCalledWith(666);
  });
  it('it passes multiple arguments correctly', () => {
    emitter.emit('expectTwoStringArgs', 'myString1', 'myString2');
    expect(listenerE).toHaveBeenCalledWith('myString1', 'myString2');
    expect(listenerF).toHaveBeenCalledWith('myString1', 'myString2');
  });
});
