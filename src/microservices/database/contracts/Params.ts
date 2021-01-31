/**
 * @description AWS RDS required parameters
 */
export type Params = {
  secretArn: string;
  resourceArn: string;
  sql: string;
  database: string;
  includeResultMetadata: boolean;
};
