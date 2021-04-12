/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'

import type { TemplateLauncher } from '../TemplateLauncher'

export class TemplateLauncher__factory {
  static connect(address: string, signerOrProvider: Signer | Provider): TemplateLauncher {
    return new Contract(address, _abi, signerOrProvider) as TemplateLauncher
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_factory',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'template',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
    ],
    name: 'TemplateAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sale',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
    ],
    name: 'TemplateLaunched',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'template',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
    ],
    name: 'TemplateRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'template',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'templateId',
        type: 'uint256',
      },
    ],
    name: 'TemplateVerified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'restrictedTemplates',
        type: 'bool',
      },
    ],
    name: 'UpdatedTemplateRestriction',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_template',
        type: 'address',
      },
    ],
    name: 'addTemplate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_templateId',
        type: 'uint256',
      },
    ],
    name: 'getTemplate',
    outputs: [
      {
        internalType: 'address',
        name: 'template',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_template',
        type: 'address',
      },
    ],
    name: 'getTemplateId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_templateId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'launchTemplate',
    outputs: [
      {
        internalType: 'address',
        name: 'newSale',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_templateId',
        type: 'uint256',
      },
    ],
    name: 'removeTemplate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'restrictedTemplates',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'templateId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'templateInfo',
    outputs: [
      {
        internalType: 'bool',
        name: 'exists',
        type: 'bool',
      },
      {
        internalType: 'uint64',
        name: 'templateId',
        type: 'uint64',
      },
      {
        internalType: 'uint128',
        name: 'index',
        type: 'uint128',
      },
      {
        internalType: 'bool',
        name: 'verified',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_restrictedTemplates',
        type: 'bool',
      },
    ],
    name: 'updateTemplateRestriction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_templateId',
        type: 'uint256',
      },
    ],
    name: 'verifyTemplate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
