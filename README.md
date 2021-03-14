# strict-mrs-mitt 🙋
This is a minimalist event-emitter, written in Typescript, providing type safety, where some preexisting solutions bail out.


## Installation

Install it via npm
```bash
npm i -S strict-mrs-mitt
```

## Usage
Just import the class constructor
```typescript
import {StrictMrsMitt} from 'strict-mrs-mitt'
```
if using Typescript describe events and their arguments in a type. One simple example how to type your events and the arguments they emit:
```Typescript
type EventMap = {
  done: () => void;
  greet: (name: string) => void;
  greetCouple: (name1: string, name2: string) => void;
};
```

Pass the types to the emitter on initialization:
```Typescript
const emitter = new StrictMrsMitt<EventMap>()
```

### Registering and unregistering listeners
Listeners can be registered via the `on` method:
```Typescript
emitter.on('done', ()=>console.log("I'm done")
```
Listeners, that should unregister after they listen do some event once can be registered using the `once` method:
```Typescript
emitter.once('done', ()=>console.log("I'm done")
```
All event listeners can be removed manually using the `off` method.
```Typescript
emitter.off('done', someHandler)
```
### Emitting Events
To emit a particular event, use the `emit` method and pass the right argument.
```Typescript
emitter.emit('greet', 'peter')
```
### Typesafety
If the emitter is passed types of events and listeners on initialization, Typescript will register if you emit events without passing the right arguments.
Examples:
 ```Typescript
type EventMap = {
  done: () => void;
  greet: (name: string) => void;
  greetCouple: (name1: string, name2: string) => void;
};
const emitter = new StrictMrsMitt<EventMap>()
// the following won't work, because 'done' does not emit the string, the registered callback expects
emitter.on('done', (name: string)=>console.log(`hello, ${name}`)
// the next example will also cause a compiler warning, since the done event won't emit the string passed to it
emitter.emit('done', 'unexpexted string arg')
```


###
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)