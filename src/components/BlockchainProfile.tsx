import { useAccount, useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';

// Replace this with your actual deployed contract address after deployment
const PROFILE_FACTORY_ADDRESS = '0x1234567890123456789012345678901234567890';

const PROFILE_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "userProfileContract",
    "outputs": [
      {
        "internalType": "contract UserProfile",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const USER_PROFILE_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_age",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_gender",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_workEnvironment",
        "type": "string"
      }
    ],
    "name": "createProfile",
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
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProfileCreated",
    "type": "event"
  }
];

export function useCreateProfile() {
  const { address } = useAccount();
  const { writeContract, isLoading, isSuccess, error } = useWriteContract();

  useWatchContractEvent({
    address: PROFILE_FACTORY_ADDRESS,
    abi: USER_PROFILE_ABI,
    eventName: 'ProfileCreated',
    onLogs(logs) {
      console.log('Profile created:', logs);
    },
  });

  const createProfile = async () => {
    if (!address) {
      console.error('No wallet connected');
      return;
    }

    try {
      const tx = await writeContract({
        address: PROFILE_FACTORY_ADDRESS,
        abi: USER_PROFILE_ABI,
        functionName: 'createProfile',
        args: ['New User', 25, 'Location', 'Prefer not to say', 'Remote'],
        value: parseEther('0.001'), // 0.001 EDU as transaction fee
      });

      console.log('Transaction submitted:', tx);
    } catch (err) {
      console.error('Error creating profile:', err);
      throw err;
    }
  };

  return { createProfile, isLoading, isSuccess, error };
}