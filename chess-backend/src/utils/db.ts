import toSnakeCase from "to-snake-case";
import { baseKnexConfig } from "../knexFile";
import knex, { Knex } from "knex";
import camelize from "camelize";
const knexConfig: Knex.Config = {
  ...baseKnexConfig,
  wrapIdentifier: (value, originalIml) => {
    if (value === "*") {
      return originalIml(value);
    }
    return originalIml(toSnakeCase(value));
  },
  postProcessResponse: (result) => {
    return camelize(result);
  },
};
export default knex(knexConfig);
