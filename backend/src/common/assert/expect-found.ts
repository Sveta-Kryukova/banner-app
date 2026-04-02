import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";

export function expectFound<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new ResourceNotFoundException();
  }
  return value;
}

export function expectFoundIndex(index: number): number {
  if (index < 0) {
    throw new ResourceNotFoundException();
  }
  return index;
}
