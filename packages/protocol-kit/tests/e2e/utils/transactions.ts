import { ContractTransactionReceipt } from 'ethers'
import { TransactionReceipt as ViemTransactionReceipt } from 'viem'
import { EthAdapter, TransactionResult } from '@safe-global/safe-core-sdk-types'
import { TransactionReceipt } from 'web3-core/types'

export async function waitSafeTxReceipt(
  txResult: TransactionResult
): Promise<ContractTransactionReceipt | TransactionReceipt | ViemTransactionReceipt | undefined> {
  const receipt:
    | ContractTransactionReceipt
    | TransactionReceipt
    | ViemTransactionReceipt
    | undefined = txResult.promiEvent
    ? await new Promise(
        (resolve, reject) =>
          txResult.promiEvent &&
          txResult.promiEvent
            .on('confirmation', (_confirmationNumber: any, receipt: TransactionReceipt) =>
              resolve(receipt)
            )
            .catch(reject)
      )
    : txResult.transactionResponse
    ? await txResult.transactionResponse.wait()
    : txResult.wait
    ? await txResult.wait()
    : undefined
  return receipt
}

export async function getTransaction(
  ethAdapter: EthAdapter,
  transactionHash: string
): Promise<any> {
  return ethAdapter.getTransaction(transactionHash)
}
