## Features

- Provide a way to discover providers with decorator
- Provide easy to use options by default

## Installation

```bash
$ npm i --save nest-discovery
```

## Usage

In order to use it you need first to `enableShutdownHooks`, then import the module

```
imports: [
  DiscoverableModule,
  ...
]
```

then annotate classes with

```
@Discoverable('key')
export class XStrategy implements Strategy {}
---
@Discoverable('key')
export class YStrategy implements Strategy {}
```

After that create a service which will discover all annotated services:

```
@Injectable()
export class StrategiesService implements OnModuleInit {
  private strategies: Strategy[] = [];

  constructor(private readonly discoverableService: DiscoverableService) {}

  onModuleInit() {
    this.strategies = this.discoverableService.getProviders<Strategy[]>('key');
  }
}
```

Now we can use strategies property
