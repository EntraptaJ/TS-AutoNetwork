// src/Utils/Containers.ts

import Container from 'typedi';
import { ContainerKeys, ValueTypes } from './Types';

export function createContainerName<
  T extends keyof typeof ContainerKeys,
  S extends string
>(key: T, id: S): `${typeof ContainerKeys[T]}${S}` {
  return `${ContainerKeys[key]}${id}` as const;
}

export function setContainer<T extends keyof typeof ContainerKeys>(
  key: T,
  id: string,
  value: ValueTypes[T],
  container = Container.of(),
): void {
  const containerName = createContainerName(key, id);

  container.set(containerName, value);
  container.set({
    id: key,
    value: id,
    multiple: true,
  });
}

export function getManyContainer<T extends keyof typeof ContainerKeys>(
  key: T,
  container = Container.of(),
): ValueTypes[T][] {
  const valueIds = container.getMany<string>(key);

  return valueIds.map((valueId) =>
    container.get(createContainerName(key, valueId)),
  );
}
