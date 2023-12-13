export type Poll = {
  title: string;
  description: string;
  options: string[];
  totalVotes: bigint;
  votesPerOption: bigint[];
  _closingTime: bigint;
};

export type PollNum = {
  title: string;
  description: string;
  options: string[];
  totalVotes: number;
  votesPerOption: number[];
  _closingTime: number;
  votesPercent: number[];
};
