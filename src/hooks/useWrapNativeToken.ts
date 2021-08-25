// External
import { useState, useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Transaction } from 'contract-proxy-kit'
import { NumberLike } from 'contract-proxy-kit/lib/cjs/utils/basicTypes'
import { utils } from 'ethers'
import { BigNumber as valueBigNumber } from 'ethers'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

// hooks
import { useCPK } from 'src/hooks/useCPK'

// contract interface
import { WXDAI__factory, WETH__factory, FixedPriceSale__factory, FairSale__factory } from 'src/contracts'

interface useWrapNativeTokenReturns {
  wrap: () => void
  transactionHash: string | null
  loading: boolean
  error: Error | null
}

export function useWrapNativeToken(
  tokenAddress: string,
  saleAddress: string,
  purchaseValue: NumberLike | undefined
): useWrapNativeTokenReturns {
  const [t] = useTranslation()
  const { library } = useWeb3React()
  const { cpk } = useCPK(library)

  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const signer = library.getSigner()

  const WETH = useMemo(() => WETH__factory.connect(tokenAddress, signer).interface, [WETH__factory])
  const WXDAI = useMemo(() => WXDAI__factory.connect(tokenAddress, signer).interface, [WXDAI__factory])
  const fixedPriceSale = useMemo(() => FixedPriceSale__factory.connect(saleAddress, signer).interface, [
    FixedPriceSale__factory,
  ])
  const fairSale = useMemo(() => FairSale__factory.connect(saleAddress, signer), [FairSale__factory])

  let value: valueBigNumber
  let tx: Transaction[]

  // @TODO: new UI required?

  // fund proxy with  ETH/XDAI before executing transactions
  // deposit into WETH/WXDAI contract
  // approve transfer of value from CPK contract
  // transfer value to Sale contract
  const wrap = useCallback(async () => {
    if (cpk && purchaseValue) {
      value = utils.parseEther(purchaseValue.toString())
      const bignumberValue = new BigNumber(value.toString())

      tx = [
        {
          to: tokenAddress,
          data: WXDAI.encodeFunctionData('deposit'),
          value: bignumberValue,
        },
        {
          to: tokenAddress,
          data: WXDAI.encodeFunctionData('approve', [saleAddress, value]),
        },
        {
          to: saleAddress,
          data: fixedPriceSale.encodeFunctionData('commitTokens', [value]),
        },
      ]
      try {
        setLoading(true)
        const depositXDAI = await signer.sendTransaction({
          to: cpk.address,
          value: value,
        })

        await depositXDAI.wait(1)
        const { hash } = await cpk.execTransactions(tx)

        if (hash) {
          setLoading(false)
          toast.success(t('success.purchase'))
          return setTransactionHash(hash)
        }
      } catch (error) {
        setLoading(false)
        setError(error)
        console.error(error)
      }
    }
  }, [cpk, purchaseValue])

  return {
    wrap,
    transactionHash,
    loading,
    error,
  }
}