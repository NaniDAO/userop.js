import { BytesLike, ethers } from "ethers";
import { ERC4337, Keep as KeepConsts } from "../../constants";
import { UserOperationBuilder } from "../../builder";
import { BundlerJsonRpcProvider } from "../../provider";
import {
  EOASignature,
  estimateUserOperationGas,
  getGasPrice,
} from "../middleware";
import {
  EntryPoint,
  EntryPoint__factory,
  KeepFactory,
  KeepFactory__factory,
  Keep as KeepImpl,
  Keep__factory,
} from "../../typechain";
import { IPresetBuilderOpts, UserOperationMiddlewareFn } from "../../types";
import { CallStruct } from "../../typechain/Keep";

enum Operation {
  call,
  delegatecall,
  create
}

interface IKeepPresetBuilderOpts extends IPresetBuilderOpts {
  calls?: CallStruct[];
  signers: string[];
  salt: BytesLike;
}

export class Keep extends UserOperationBuilder {
  private signer: ethers.Signer;
  private provider: ethers.providers.JsonRpcProvider;
  private entryPoint: EntryPoint;
  private factory: KeepFactory;
  private initCode: string;
  proxy: KeepImpl;

  private constructor(
    signer: ethers.Signer,
    rpcUrl: string,
    opts?: IPresetBuilderOpts
  ) {
    super();
    this.signer = signer;
    this.provider = new BundlerJsonRpcProvider(rpcUrl).setBundlerRpc(
      opts?.overrideBundlerRpc
    );
    this.entryPoint = EntryPoint__factory.connect(
      opts?.entryPoint || ERC4337.EntryPoint,
      this.provider
    );
    this.factory = KeepFactory__factory.connect(
      opts?.factory || KeepConsts.Factory,
      this.provider
    );
    this.initCode = "0x";
    this.proxy = Keep__factory.connect(
      ethers.constants.AddressZero,
      this.provider
    );
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0);
    ctx.op.initCode = ctx.op.nonce.eq(0) ? this.initCode : "0x";
  };

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    opts?: IKeepPresetBuilderOpts
  ): Promise<Keep> {
    const instance = new Keep(signer, rpcUrl, opts);

    try {
      const signerAddr = await instance.signer.getAddress();
      instance.initCode = await ethers.utils.hexConcat([
        instance.factory.address,
        instance.factory.interface.encodeFunctionData("deployKeep", [
          opts?.salt ?? signerAddr,
          opts?.calls ?? [{
            op: Operation.call,
            to: signerAddr,
            value: ethers.constants.Zero,
            data: "0x",
          }],
          [signerAddr],
          ethers.BigNumber.from(1)
        ]),
      ]);
      await instance.entryPoint.callStatic.getSenderAddress(instance.initCode);

      throw new Error("getSenderAddress: unexpected result");
    } catch (error: any) {
      const addr = error?.errorArgs?.sender;
      if (!addr) throw error;

      instance.proxy = Keep__factory.connect(addr, instance.provider);
    }

    const base = instance
      .useDefaults({
        sender: instance.proxy.address,
        signature: await instance.signer.signMessage(
          ethers.utils.arrayify(ethers.utils.keccak256("0xdead"))
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.provider));

    const withPM = opts?.paymasterMiddleware
      ? base.useMiddleware(opts.paymasterMiddleware)
      : base.useMiddleware(estimateUserOperationGas(instance.provider));

    return withPM.useMiddleware(EOASignature(instance.signer));
  }

  execute(call: CallStruct) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("relay", [call])
    );
  }

  executeBatch(calls: CallStruct[]) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("multirelay", [calls])
    );
  }
}

