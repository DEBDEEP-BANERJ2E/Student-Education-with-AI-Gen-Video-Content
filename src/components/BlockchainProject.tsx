import { useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';

// Replace with your deployed contract address after deployment
const USER_PROFILE_ADDRESS = '0x1234567890123456789012345678901234567890';

const USER_PROFILE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_projectIndex",
        "type": "uint256"
      }
    ],
    "name": "completeProject",
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
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      }
    ],
    "name": "ProjectCompleted",
    "type": "event"
  }
];

export function useCompleteProject() {
  const { writeContract, isLoading, isSuccess, error } = useWriteContract();

  useWatchContractEvent({
    address: USER_PROFILE_ADDRESS,
    abi: USER_PROFILE_ABI,
    eventName: 'ProjectCompleted',
    onLogs(logs) {
      console.log('Project completed:', logs);
    },
  });

  const completeProject = async (userAddress: string, projectIndex: number) => {
    try {
      const tx = await writeContract({
        address: USER_PROFILE_ADDRESS,
        abi: USER_PROFILE_ABI,
        functionName: 'completeProject',
        args: [userAddress, projectIndex],
        value: parseEther('0.00001'), // 0.00001 EDU as transaction fee
      });

      console.log('Transaction submitted:', tx);
      return tx;
    } catch (err) {
      console.error('Error completing project:', err);
      throw err;
    }
  };

  return { completeProject, isLoading, isSuccess, error };
}