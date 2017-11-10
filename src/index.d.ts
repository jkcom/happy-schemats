import { Database } from './schema';
import Options, { OptionValues } from './options';
export declare function typescriptOfTable(db: Database | string, table: string, schema: string, options?: Options): Promise<string>;
export declare function typescriptOfSchema(db: Database | string, tables?: string[], schema?: string | null, options?: OptionValues): Promise<string>;
export { Database, getDatabase } from './schema';
export { Options, OptionValues };
