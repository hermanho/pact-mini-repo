import { IsNotEmpty, IsString } from 'class-validator';
import 'reflect-metadata';

export class HelloRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
