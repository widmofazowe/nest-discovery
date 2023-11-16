import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import iterate from 'iterare';
import { DISCOVER_METADATA_KEY } from './discoverable.decorator';

type InstanceWrapper = {
  metatype: unknown;
  name: string;
  instance: unknown;
};

@Injectable()
export class DiscoverableService implements OnModuleInit {
  private providers: Record<string | symbol, unknown[]> = {};

  constructor(private discoveryService: DiscoveryService) {}

  public getProviders<T extends unknown[]>(key?: string | symbol): T {
    const providers = key ? this.providers[key] : Object.values(this.providers).flat();

    return (providers || []) as T;
  }

  public getKeys(): string[] {
    return Object.keys(this.providers);
  }

  onModuleInit() {
    this.providers = this.scanDiscoverableInstanceWrappers(this.discoveryService.getProviders());
  }

  private scanDiscoverableInstanceWrappers(wrappers: InstanceWrapper[]) {
    return iterate(wrappers)
      .filter(({ metatype }) => metatype && this.getMetadata(metatype))
      .reduce((acc, { metatype, instance, name }) => {
        const type = this.getMetadata(metatype);

        return {
          ...acc,
          [type]: (acc[type] || []).concat(instance),
        };
      }, {});
  }

  private getMetadata(metatype: any) {
    return Reflect.getMetadata(DISCOVER_METADATA_KEY, metatype);
  }
}
