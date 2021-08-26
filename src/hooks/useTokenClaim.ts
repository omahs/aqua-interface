// Externals
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ContractReceipt, ContractTransaction, Transaction } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

//hooks
import { useCPK } from 'src/hooks/useCPK'

// contracts
import { FixedPriceSale__factory } from 'src/contracts'

//redux
import { setClaimStatus } from 'src/redux/claims'

//interface
import { GetFixedPriceSaleCommitmentsByUser_fixedPriceSaleCommitments_sale } from 'src/subgraph/__generated__/GetFixedPriceSaleCommitmentsByUser'
import { ProviderRpcError } from 'src/interfaces/Error'
import { TransactionResult } from 'contract-proxy-kit'

export enum ClaimState {
  UNCLAIMED = 'UNCLAIMED',
  VERIFY = 'VERIFY',
  FAILED = 'FAILED',
  CLAIMED = 'CLAIMED',
  PROCESSED = 'PROCESSED',
}

interface useTokenClaimReturns {
  claim: ClaimState | null
  claimTokens: (saleId: string) => void
  closeSale: (saleId: string, handleClose: (closed: boolean) => void) => void
  transaction: ContractReceipt | null
  error: Error | null
}

export function useTokenClaim(
  sale: GetFixedPriceSaleCommitmentsByUser_fixedPriceSaleCommitments_sale
): useTokenClaimReturns {
  const dispatch = useDispatch()
  const { account, library, chainId } = useWeb3React()
  const { cpk } = useCPK(library)
  const { claimToken: claim, error, transaction, amount } = useSelector(
    ({ claims }) =>
      claims.claims.find(claim => claim.sale.id === sale.id) || {
        claimToken: ClaimState.UNCLAIMED,
        sale: sale,
        error: null,
        transaction: null,
        amount: null,
      }
  )
  const [t] = useTranslation()
  const signer = library?.getSigner()

  useEffect(() => {
    if (!chainId || !library || !account) {
      return
    }
  }, [account, chainId, library])

  const closeSale = (saleId: string, handleClose: (closed: boolean) => void) => {
    // check if cpk proxy contract has tokens
    if (account) {
      FixedPriceSale__factory.connect(saleId, signer)
        .closeSale()
        .then(tx => tx.wait(1))
        .then(() => {
          toast.success(t('success.saleClosed'))
          handleClose(true)
        })
        .catch((error: Error) => {
          console.error(error)
          toast.error(t('errors.saleClose'))
        })
    }
  }

  const claimTokens = (saleId: string) => {
    if (cpk) {
      const tx = [
        {
          to: saleId,
          data: FixedPriceSale__factory.connect(saleId, signer).interface.encodeFunctionData('withdrawTokens', [
            cpk.address as string,
          ]),
        },
      ]
      cpk
        .execTransactions(tx)
        .then((tx: TransactionResult) => {
          dispatch(
            setClaimStatus({
              sale: sale,
              claimToken: ClaimState.VERIFY,
              error: null,
              transaction: null,
              amount: amount,
            })
          )
          console.log(tx)
          toast.success(t('success.claim'))
          return dispatch(
            setClaimStatus({
              sale: sale,
              claimToken: ClaimState.CLAIMED,
              error: null,
              transaction: null,
              amount: amount,
            })
          )
        })
        .catch((error: ProviderRpcError) => {
          if (error.code == 4001) {
            toast.error(t('errors.claim'))
            return dispatch(
              setClaimStatus({
                sale: sale,
                claimToken: ClaimState.UNCLAIMED,
                error: error,
                transaction: null,
                amount: amount,
              })
            )
          }
          console.error(error)
          toast.error(t('errors.claim'))
          return dispatch(
            setClaimStatus({
              sale: sale,
              claimToken: ClaimState.FAILED,
              error: error,
              transaction: null,
              amount: amount,
            })
          )
        })
    }
    if (account) {
      // Withdraw tokens - withdraws investment or purchase depending on if successful
      FixedPriceSale__factory.connect(saleId, signer)
        .withdrawTokens(account)
        .then((tx: ContractTransaction) => {
          dispatch(
            setClaimStatus({
              sale: sale,
              claimToken: ClaimState.VERIFY,
              error: null,
              transaction: null,
              amount: amount,
            })
          )
          return tx.wait(1)
        })
        .then((tx: ContractReceipt) => {
          toast.success(t('success.claim'))
          return dispatch(
            setClaimStatus({
              sale: sale,
              claimToken: ClaimState.CLAIMED,
              error: null,
              transaction: tx,
              amount: amount,
            })
          )
        })
        .catch((error: ProviderRpcError) => {
          if (error.code == 4001) {
            return dispatch(
              setClaimStatus({
                sale: sale,
                claimToken: ClaimState.UNCLAIMED,
                error: error,
                transaction: null,
                amount: amount,
              })
            )
          }

          console.error(error)
          toast.error(t('errors.claim'))
          return dispatch(
            setClaimStatus({
              sale: sale,
              claimToken: ClaimState.FAILED,
              error: error,
              transaction: null,
              amount: amount,
            })
          )
        })
    }
  }
  return {
    claim,
    claimTokens,
    closeSale,
    error,
    transaction,
  }
}
