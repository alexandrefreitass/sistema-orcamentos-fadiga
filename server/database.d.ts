declare module './database' {
  export const pool: any;
  export function query(sql: string, params?: any[]): Promise<any[]>;
  export function testConnection(): Promise<boolean>;
}