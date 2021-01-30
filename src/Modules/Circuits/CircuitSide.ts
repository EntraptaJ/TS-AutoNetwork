// src/Modules/Circuits/CircuitSide.ts
import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsValidID } from '../../Utils/Validator';

@JSONSchema({
  title: 'Circuit Side',
  description: 'A single circuit connection',
  additionalProperties: false,
})
export class CircuitSide {
  @IsString()
  @IsValidID('CIRCUIT_LOCATION')
  @JSONSchema({
    description: 'Circuit ID referencing the CircuitLocation ID',
  })
  public id: string;
}
