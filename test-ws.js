import { Web3 } from "web3";
import dotenv from "dotenv";

dotenv.config();

const INFURA_WS = process.env.INFURA_WS || "ws://127.0.0.1:8545/"; // WebSocket RPC URL
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Initialize Web3 using WebSockets
const web3 = new Web3(new Web3.providers.WebsocketProvider(INFURA_WS));

const CONTRACT_ABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" }
        ],
        name: "Transfer",
        type: "event"
    }
];

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

async function main() {
    console.log(`🎧 Listening for Transfer events on contract: ${CONTRACT_ADDRESS}`);

    contract.events.Transfer({ fromBlock: "latest" })
        .on("data", (event) => {
            console.log(`🔥 New Transfer detected!`);
            console.log(`🔹 From: ${event.returnValues.from}`);
            console.log(`🔹 To: ${event.returnValues.to}`);
            console.log(`🔹 Token ID: ${event.returnValues.tokenId}`);
            console.log("----------------------------");
            console.log("save to db");

        })
        .on("error", (error) => {
            console.error("❌ Error:", error);
        });
}

main().catch(console.error);

// websocket
// RPC () query tung block
// 3rd parties