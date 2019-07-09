export interface IRedis {
    get(prefix: string, key: string): Promise<string>
    set(prefix: string, key: string, value: string, expiry?: number): Promise<number> // TODO: Check
    del(prefix: string, key: string): Promise<string>
}