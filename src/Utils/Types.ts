// src/Utils/Types.ts
import { Circuit } from '../Modules/Circuits/Circuit';
import { CircuitLocation } from '../Modules/Circuits/CircuitLocation';
import { Community } from '../Modules/Communities/Community';
import { Site } from '../Modules/Sites/Site';
import { Contact } from '../Modules/Contacts/Contact';
import { SiteDevice } from '../Modules/SiteDevice/SiteDevice';
import { Network } from '../Modules/Networks/Network';
import { NetworkHost } from '../Modules/Networks/NetworkHost';

export type ValueTypes = {
  CONTACT: Contact;
  COMMUNITY: Community;
  SITEDEVICE: SiteDevice;
  SITE: Site;
  CIRCUITLOCATION: CircuitLocation;
  CIRCUIT: Circuit;
  NETWORKHOST: NetworkHost;
  NETWORK: Network;
};

export type ContainerKeyMap = {
  [key in keyof ValueTypes]: ValueTypes[key] extends {
    constructor: { name: string };
  }
    ? `${Lowercase<key>}-`
    : string;
};

export const ContainerKeys: ContainerKeyMap = {
  CONTACT: 'contact-',
  COMMUNITY: 'community-',
  SITEDEVICE: 'sitedevice-',
  SITE: 'site-',
  CIRCUITLOCATION: 'circuitlocation-',
  CIRCUIT: 'circuit-',
  NETWORKHOST: 'networkhost-',
  NETWORK: 'network-',
} as const;

// export enum ContainerKeys {}
/* 
type TypeIDField = {
  [key in keyof typeof ContainerKeys]: keyof ValueTypes[key];
}; */

export const idFields = {
  CIRCUIT: 'id',
  CIRCUITLOCATION: 'id',
  COMMUNITY: 'id',
  CONTACT: 'id',
  NETWORK: 'prefix',
  NETWORKHOST: 'ip',
  SITE: 'id',
  SITEDEVICE: 'id',
} as const;

// export enum TypeIDField {
//   CONTACT = 'id',
//   COMMUNITY = 'id',
//   SITEDEVICE = 'id',
//   SITE = 'id',
//   CIRCUITLOCATION = 'id',
//   CIRCUIT = 'id',
//   NETWORKHOST = 'ip',
//   NETWORK = 'prefix',
// }

type IsIPAMType<T> = T extends ValueTypes[keyof ValueTypes] ? true : false;

/*
type NonNullableUserPropertyKeys = {
  [P in keyof User]: null extends User[P] ? never : P;
}[keyof User];

type NonNullablePropertyKeys<T> = {
  [P in keyof T]: null extends T[P] ? never : P;
}[keyof T]; */

// type IPAMType<T> = IsIPAMType<T> extends true ? true : false;

type GetID<T, M = typeof idFields> = IsIPAMType<T> extends true
  ? {
      [key in keyof ValueTypes]: ValueTypes[key] extends T
        ? key extends keyof M
          ? M[key]
          : false
        : false;
    }[keyof ValueTypes]
  : false;

type IsContainerKey<T> = T extends ContainerKeyMap[keyof ContainerKeyMap]
  ? true
  : false;

// type GetIDField<T> = IPAMType<T> extends false ? never : TypeIDField;

// type Testing2 = GetIDField<Network>;

export function isContainerKey<T>(key?: T): IsContainerKey<T> {
  if (typeof key === 'string') {
    return Object.keys(ContainerKeys).includes(key ?? '') as IsContainerKey<T>;
  }

  return false as IsContainerKey<T>;
}
export interface ClassType<T = unknown> {
  new (...args: any[]): T;
}

// type ObjectClass<C> = ClassType<C> extends infer r ? r : unknown;

export function isIPAMType<N extends keyof ValueTypes>(
  type: ValueTypes[keyof ValueTypes],
): type is ValueTypes[keyof ValueTypes] {
  const className = type?.constructor.name.toUpperCase() as N;

  if (isContainerKey(className) === true) {
    return true;
  }

  return false;
}

export type ObjectGet<X> = {
  readonly [key in keyof X]: X[key] extends string | number
    ? X[key]
    : ObjectGet<X[key]>;
};

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type ArrayType<T> = T extends (infer A)[] ? A : T;

export type Intersect<T> = (T extends unknown ? (x: T) => 0 : never) extends (
  x: infer R,
) => 0
  ? R
  : never;

export function getIDField<
  T extends ValueTypes[keyof ValueTypes],
  L extends GetID<T, typeof idFields>
>(type: T): L extends string ? [L, string] : false {
  const className = type?.constructor.name.toUpperCase() as keyof ValueTypes;

  if (Object.keys(idFields).includes(className)) {
    const field = idFields[className];

    /**
     * TODO: Make this type properly.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [field, type[field]] as L extends string ? [L, string] : false;
  }

  return false as L extends string ? [L, string] : false;
}
