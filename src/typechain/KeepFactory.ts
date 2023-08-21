/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export type CallStruct = {
  op: BigNumberish;
  to: string;
  value: BigNumberish;
  data: BytesLike;
};

export type CallStructOutput = [number, string, BigNumber, string] & {
  op: number;
  to: string;
  value: BigNumber;
  data: string;
};

export interface KeepFactoryInterface extends utils.Interface {
  functions: {
    "deployKeep(bytes32,(uint8,address,uint256,bytes)[],address[],uint256)": FunctionFragment;
    "determineKeep(bytes32)": FunctionFragment;
    "multicall(bytes[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "deployKeep" | "determineKeep" | "multicall"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deployKeep",
    values: [BytesLike, CallStruct[], string[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "determineKeep",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;

  decodeFunctionResult(functionFragment: "deployKeep", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "determineKeep",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;

  events: {
    "Deployed(address,address[],uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deployed"): EventFragment;
}

export interface DeployedEventObject {
  keep: string;
  signers: string[];
  threshold: BigNumber;
}
export type DeployedEvent = TypedEvent<
  [string, string[], BigNumber],
  DeployedEventObject
>;

export type DeployedEventFilter = TypedEventFilter<DeployedEvent>;

export interface KeepFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: KeepFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    deployKeep(
      name: BytesLike,
      calls: CallStruct[],
      signers: string[],
      threshold: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    determineKeep(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    multicall(
      data: BytesLike[],
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  deployKeep(
    name: BytesLike,
    calls: CallStruct[],
    signers: string[],
    threshold: BigNumberish,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  determineKeep(name: BytesLike, overrides?: CallOverrides): Promise<string>;

  multicall(
    data: BytesLike[],
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    deployKeep(
      name: BytesLike,
      calls: CallStruct[],
      signers: string[],
      threshold: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    determineKeep(name: BytesLike, overrides?: CallOverrides): Promise<string>;

    multicall(data: BytesLike[], overrides?: CallOverrides): Promise<string[]>;
  };

  filters: {
    "Deployed(address,address[],uint256)"(
      keep?: string | null,
      signers?: null,
      threshold?: null
    ): DeployedEventFilter;
    Deployed(
      keep?: string | null,
      signers?: null,
      threshold?: null
    ): DeployedEventFilter;
  };

  estimateGas: {
    deployKeep(
      name: BytesLike,
      calls: CallStruct[],
      signers: string[],
      threshold: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    determineKeep(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    multicall(
      data: BytesLike[],
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deployKeep(
      name: BytesLike,
      calls: CallStruct[],
      signers: string[],
      threshold: BigNumberish,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    determineKeep(
      name: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    multicall(
      data: BytesLike[],
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
