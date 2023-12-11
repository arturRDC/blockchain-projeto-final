import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import Web3 from 'web3';

type PollNum = {
  title: string;
  description: string;
  options: string[];
  totalVotes: number;
  votesPerOption: number[];
  _closingTime: bigint;
};

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class PollService {
  private web3: any;
  private contract: any;
  private accounts: string[] = [];
  contractAddress = '0x927E2AE538FAf928CC6cD57FE18dD4ED72C96545';
  private abi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_screenwriter',
          type: 'address',
        },
      ],
      name: 'addScreenwriter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_title',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '_description',
          type: 'string',
        },
        {
          internalType: 'string[]',
          name: '_options',
          type: 'string[]',
        },
        {
          internalType: 'uint256',
          name: '_duration',
          type: 'uint256',
        },
      ],
      name: 'createPoll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_screenwriter',
          type: 'address',
        },
      ],
      name: 'removeScreenwriter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_voteVerseToken',
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
          indexed: false,
          internalType: 'address',
          name: 'ownerPoll',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'title',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'description',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string[]',
          name: 'options',
          type: 'string[]',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'id',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'closingTime',
          type: 'uint256',
        },
      ],
      name: 'CreatePoll',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_id',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_option',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_tokenAmount',
          type: 'uint256',
        },
      ],
      name: 'votePoll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'voter',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'option',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'totalVotes',
          type: 'uint256',
        },
      ],
      name: 'VotePoll',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_id',
          type: 'uint256',
        },
      ],
      name: 'getPoll',
      outputs: [
        {
          internalType: 'string',
          name: 'title',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'description',
          type: 'string',
        },
        {
          internalType: 'string[]',
          name: 'options',
          type: 'string[]',
        },
        {
          internalType: 'uint256',
          name: 'totalVotes',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: 'votesPerOption',
          type: 'uint256[]',
        },
        {
          internalType: 'uint256',
          name: '_closingTime',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
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
          name: '',
          type: 'uint256',
        },
      ],
      name: 'pollIDs',
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
      inputs: [],
      name: 'voteVerseToken',
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
  ];

  constructor() {
    // this.web3 = new Web3((window as any).ethereum);
    this.initializeWeb3();
  }

  private async initializeWeb3(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      window.web3 = new Web3(window.ethereum);
      this.accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      this.web3 = window.web3;
      console.log('init accounts' + this.accounts[0]);
      // this.accounts = await this.web3.eth.getAccounts();

      this.contract = new this.web3.eth.Contract(
        this.abi,
        this.contractAddress
      );
      console.log('initweb3 contract', this.contract);
    } else {
      console.error(
        'Non-Ethereum browser detected. You should consider using MetaMask!'
      );
    }
  }

  public getAccount(): string {
    return this.accounts[0];
  }

  async getPoll(pollId: string): Promise<PollNum> {
    if (!this.web3) {
      this.initializeWeb3();
      // this.contract = new this.web3.eth.Contract(
      //   this.abi,
      //   this.contractAddress
      // );
    }
    console.log('contract', this.contract);
    const poll = await this.contract.methods.getPoll(pollId).call();
    console.log(this.contract);
    return {
      title: poll[0],
      description: poll[1],
      options: poll[2],
      totalVotes: Number(poll[3]),
      votesPerOption: poll[4].map(Number),
      _closingTime: BigInt(poll[5]),
    };
  }
  async votePoll(
    pollId: string,
    option: number | null,
    amount: number
  ): Promise<any> {
    if (option == null) {
      option = 0;
    }
    // let accounts = await this.web3.eth.getAccounts();
    let fromAddress = this.getAccount();
    const gasPrice = await this.web3.eth.getGasPrice();
    console.log('vote address ' + fromAddress);
    console.log(gasPrice);
    return await this.contract.methods
      .votePoll(BigInt(pollId), BigInt(option), BigInt(amount))
      .send({ from: fromAddress, gas: gasPrice });
  }
}
