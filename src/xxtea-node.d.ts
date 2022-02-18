declare module "xxtea-node"{
    function encryptToString(str:string|Uint8Array,key:string|Uint8Array):string;
    function decryptToString(str:string|Uint8Array,key:string|Uint8Array):string;
    function decrypt(str: string | Uint8Array, key: string | Uint8Array):Uint8Array;
    function encrypt(str: string | Uint8Array, key: string | Uint8Array): Uint8Array;
}