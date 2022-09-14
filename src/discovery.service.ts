import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService as NestjsDiscoveryService } from '@nestjs/core';
import iterate from 'iterare';
import { DISCOVER_METADATA_KEY } from './discoverable.decorator';

type InstanceWrapper = {
  metatype: unknown;
  name: string;
  instance: unknown;
};

@Injectable()
export class DiscoveryService implements OnModuleInit {
  private providers: Record<string | symbol, unknown[]> = {};

  constructor(private discoveryService: NestjsDiscoveryService) {}

  public getProviders<T extends unknown[]>(key?: string | symbol): T {
    const providers = key ? this.providers[key] : Object.values(this.providers).flat();

    return (providers || []) as T;
  }

  onModuleInit(): void {
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
