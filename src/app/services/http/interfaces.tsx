export interface IHttpConfig {
    server: string;
    onMessage?: IOnMessageFunction;
}

interface IOnMessageFunction {
    (message: string): void;
}
