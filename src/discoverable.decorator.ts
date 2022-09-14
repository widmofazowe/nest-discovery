import { SetMetadata } from '@nestjs/common';

export const DISCOVER_METADATA_KEY = Symbol('__discoverable__');

export const Discoverable = (name: string) => SetMetadata(DISCOVER_METADATA_KEY, name);
