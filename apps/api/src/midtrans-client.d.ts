declare module 'midtrans-client' {
  export class CoreApi {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    charge(parameter: any): Promise<any>;
    transaction: {
      notification(parameter: any): Promise<any>;
    };
  }

  export class Snap {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(parameter: any): Promise<any>;
    createTransactionToken(parameter: any): Promise<any>;
  }

  export class PaymentLink {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createPaymentLink(parameter: any): Promise<any>;
  }
}
