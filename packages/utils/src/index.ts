import {
    recoverPublicKey,
} from "ethers/lib/utils";
import {blake2AsHex, encodeAddress, secp256k1Compress} from "@polkadot/util-crypto";
import {hexToU8a} from "@polkadot/util";
export default class Utils{

    public static recoverEcdsaPublicKey(msgHash: Uint8Array, ecdsaSignature:string){
        return recoverPublicKey(msgHash,ecdsaSignature)
    }
    public static getSubstrateAddressFromEcdsa(publicKey: string, ss58=88){
        const compressPubicKey= secp256k1Compress(hexToU8a(publicKey))
        const accountId32 = blake2AsHex(compressPubicKey,256);
        return encodeAddress(accountId32,ss58)
    }

}
