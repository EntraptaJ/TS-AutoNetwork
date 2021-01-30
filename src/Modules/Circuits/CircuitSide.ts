// src/Modules/Circuits/CircuitSide.ts
import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({
  title: 'Circuit Side',
  description: 'A single circuit connection',
  additionalProperties: false,
})
export class CircuitSide {
  @IsString()
  @JSONSchema({
    description: 'Circuit ID referencing the CircuitLocation ID',
  })
  public id: string;
}
