export interface TransferQuery {
  row: number;
  page: number;
  address?: string;
  extrinsic_index?: string;
  blockRange?: { start: number, end: number }
  direction?: "all" | "sent" | "received";
  asset_symbol?: string;
  afterId?: [number, number];
}

export interface DepositQuery extends TransferQuery {
  address: string;
  blockRange: { start: number, end: number }
}

export interface WithdrawQuery extends TransferQuery {
  address: string;
  blockRange: { start: number, end: number }
}

export default class SubScan {
  baseUrl: string;
  apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async getTransfers(query: TransferQuery) {
    const response = await fetch(`${this.baseUrl}/api/v2/scan/transfers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify(query)
    })
    const body = await response.json();
    return body.data.transfers;
  }

  async getEvents() { }

  getDeposits(query: DepositQuery) {
    return this.getTransfers({ ...query, direction: "received" })
  }

  getWithdrawals(query: WithdrawQuery) {
    return this.getTransfers({ ...query, direction: "sent" })
  }

}
