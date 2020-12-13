import { Controller, Get } from "@nestjs/common";
import { DockerService } from "./docker.service";

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get()
  run(): Promise<string> {
    return this.dockerService.runFile('', 'c++');
  }
}
