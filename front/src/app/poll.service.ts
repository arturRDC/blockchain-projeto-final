import { Injectable } from '@angular/core';
import { abi } from './abi';
import { Observable, Subject } from 'rxjs';
import Web3 from 'web3';

type PollNum = {
  title: string;
  description: string;
  options: string[];
  totalVotes: number;
  votesPerOption: number[];
  _closingTime: number;
  votesPercent: number[];
};

type Poll = {
  title: string;
  description: string;
  options: string[];
  totalVotes: bigint;
  votesPerOption: bigint[];
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
  private pollUpdates = new Subject<PollNum>();
  contractAddress = '0x7531DA280C5628c1b7488370202b1e8aa37BfA3E';

  constructor() {
    this.initializeWeb3();
  }

  private async initializeWeb3(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      window.web3 = new Web3(window.ethereum);
      this.accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      this.web3 = window.web3;
      // convert to checksum so it's uppercase
      this.accounts = this.accounts.map((address) =>
        this.web3.utils.toChecksumAddress(address)
      );

      this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
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

  convertPollToPollNum(poll: Poll): PollNum {
    // Convert bigint fields to number
    const totalVotes = Number(poll.totalVotes);
    const votesPerOption = poll.votesPerOption.map(Number);
    const _closingTime = Number(poll._closingTime);

    // Calculate votesPercent
    let votesPercent: number[];
    if (totalVotes === 0) {
      // If totalVotes is 0, set votesPercent to an array of zeros
      votesPercent = votesPerOption.map(() => 0);
    } else {
      // Otherwise, calculate votesPercent as before
      votesPercent = votesPerOption.map((vote) => (vote / totalVotes) * 100);
    }

    // Return new PollNum object
    return {
      ...poll,
      totalVotes,
      votesPerOption,
      _closingTime,
      votesPercent,
    };
  }

  async getPoll(pollId: string): Promise<PollNum> {
    if (!this.web3) {
      await this.initializeWeb3();
    }
    const poll: Poll = await this.contract.methods.getPoll(pollId).call();
    return this.convertPollToPollNum(poll);
  }
  async votePoll(
    pollId: string,
    option: number | null,
    amount: number
  ): Promise<any> {
    if (option == null) {
      option = 0;
    }
    let fromAddress = this.getAccount();

    await this.contract.methods
      .votePoll(Number(pollId), option, amount)
      .send({ from: fromAddress });

    // Fetch and emit the updated poll data
    const updatedPoll = await this.getPoll(pollId);
    this.pollUpdates.next(updatedPoll);
  }

  async createPoll(
    title: string,
    description: string,
    options: number[] | null,
    duration: number
  ): Promise<number> {
    let fromAddress = this.getAccount();

    const tx = await this.contract.methods
      .createPoll(title, description, options, duration)
      .send({ from: fromAddress });
    const id: number = tx.events.CreatePoll.returnValues.id;
    return id;
  }

  public getPollUpdates(): Observable<PollNum> {
    return this.pollUpdates.asObservable();
  }

  public async isWriter(): Promise<boolean> {
    if (!this.web3) {
      await this.initializeWeb3();
    }
    const isWriter: boolean = await this.contract.methods
      .authorizedsScreenwriters(this.getAccount())
      .call();
    return isWriter;
  }

  public async canAddWriter(): Promise<boolean> {
    if (!this.web3) {
      await this.initializeWeb3();
    }

    const owner: string = await this.contract.methods.owner().call();
    return owner === this.getAccount();
  }

  async addWriter(_screenwriter: string) {
    if (_screenwriter == null) {
      return;
    }
    let fromAddress = this.getAccount();

    await this.contract.methods
      .addScreenwriter(_screenwriter)
      .send({ from: fromAddress });
  }
}
