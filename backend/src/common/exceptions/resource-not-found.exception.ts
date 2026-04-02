import { NotFoundException } from "@nestjs/common";

export class ResourceNotFoundException extends NotFoundException {
  constructor() {
    super("Resource not found");
  }
}
