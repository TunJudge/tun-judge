import { Module } from '@nestjs/common';
import { DockerService } from './docker.service';
import { DockerController } from './docker.controller';

@Module({
  providers: [DockerService],
  controllers: [DockerController],
})
export class DockerModule {}
