import { useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';

const POSTING_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

const POSTING_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_postingId",
        "type": "string"
      }
    ],
    "name": "completePosting",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "postingId",
        "type": "string"
      }
    ],
    "name": "PostingCompleted",
    "type": "event"
  }
];

export function useCompletePosting() {
  const { writeContract, isLoading, isSuccess, error } = useWriteContract();

  useWatchContractEvent({
    address: POSTING_CONTRACT_ADDRESS,
    abi: POSTING_CONTRACT_ABI,
    eventName: 'PostingCompleted',
    onLogs(logs) {
      console.log('Posting completed:', logs);
    },
  });

  const completePosting = async (postingId: string) => {
    try {
      const tx = await writeContract({
        address: POSTING_CONTRACT_ADDRESS,
        abi: POSTING_CONTRACT_ABI,
        functionName: 'completePosting',
        args: [postingId],
        value: parseEther('0.00001'), // 0.00001 EDU as transaction fee
      });

      console.log('Transaction submitted:', tx);
      return tx;
    } catch (err) {
      console.error('Error completing posting:', err);
      throw err;
    }
  };

  return { completePosting, isLoading, isSuccess, error };
}