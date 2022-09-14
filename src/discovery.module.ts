import { Module } from '@nestjs/common';
import { DiscoveryModule as NestjsDiscoveryModule } from '@nestjs/core';
import { DiscoveryService } from './discovery.service';

@Module({
  imports: [NestjsDiscoveryModule],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
