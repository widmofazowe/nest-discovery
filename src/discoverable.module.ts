import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { DiscoverableService } from './discoverable.service';

@Module({
  imports: [DiscoveryModule],
  providers: [DiscoverableService],
  exports: [DiscoverableService],
})
export class DiscoverableModule {}
