import { ApiPromise, WsProvider } from '@polkadot/api';
import {GenericExtrinsicPayload, GenericSignerPayload} from "@polkadot/types";
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";
import {blake2AsU8a} from "@polkadot/util-crypto";

export type ApiOptions = {
  url?:string,
  isMain?:string
}

export type ChainType =  "ethereum" | "substrate"
export type SigType= "ECDSA"

const MAINNET_URL= "wss://mainnet.polkadex.trade"
const TESTNET_URL= "wss://blockchain.polkadex.trade"
export default class PolkadexApi{
  api:ApiPromise
  constructor(options: ApiOptions) {
    let provider;
    if(options.url){
      provider = new WsProvider(options.url,2000)
    }
    else if(options.isMain){
      provider = new WsProvider(MAINNET_URL)
    }
    else{
      provider= new WsProvider(TESTNET_URL)
    }
    this.api= new ApiPromise({provider})
  }

  public Api(): ApiPromise{
    return this.api
  }
  public async createExtrinsicPayload(tx: string, address:string):Promise<GenericExtrinsicPayload>{
    const nonce = await this.getAccountNonce(address)
    const signingPayload = this.api.createType('SignerPayload', {
      method: tx,
      nonce: nonce,
      genesisHash: this.api.genesisHash,
      blockHash: this.api.genesisHash,
      runtimeVersion: this.api.runtimeVersion,
      version: this.api.extrinsicVersion
    })
    return this.api.createType('ExtrinsicPayload', signingPayload.toPayload(), { version: this.api.extrinsicVersion })
  }
  public getHashedExtrinsicPayload(extrinsicPayload: GenericExtrinsicPayload, network: ChainType):Uint8Array{
    const u8a = extrinsicPayload.toU8a({ method: true })
    if(network==="ethereum"){
      const encoded = u8a.length > 256
          ? blake2AsU8a(u8a)
          : u8a;
      return blake2AsU8a(encoded)
    }
    else{
      throw new Error("unknown network type")
    }
  }
  public getTransactionSender(tx: SubmittableExtrinsic, address:string, signature: Uint8Array, extrinsicPayload: GenericSignerPayload, sigType:SigType="ECDSA"){
    let multiSignature;
    if(sigType === "ECDSA"){
      //update the recovery bit if signed by eth compatible wallets
      if(signature[signature.length-1] > 3){
        signature[signature.length-1]-=27
      }
      multiSignature = this.api.createType("MultiSignature", {ecdsa: signature})
    }
    else{
      throw new Error("unknown signature type")
    }
    tx.addSignature(address, multiSignature.toHex(), extrinsicPayload.toPayload())
    return tx.send
  }
  async getAccountNonce (address:string){
    const {nonce} = (await this.api.query.system.account(address)).toJSON() as any
    return Number(nonce) + 1;
  }

}

