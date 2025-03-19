import './App.css';
import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route, Outlet } from 'react-router-dom';
import Home from './services/Home';
import CreateNFT from './services/CreateNFT';
import MyNFTs from './services/MyNFTs';
import Dashboard from './services/Dashboard';
import ResellNFT from './services/ResellNFT';
import WalletConnect from "./services/WalletConnect";

function App() {
  return (
    <div>
    <nav className="border-b p-6">
      <p className="text-4xl font-bold">NFT Marketplace</p>
      <div className="flex mt-4">
        <Link to="/" className="mr-4 text-pink-500">Home</Link>
        <Link to="/create-nft" className="mr-6 text-pink-500">Create NFT</Link>
        <Link to="/my-nfts" className="mr-6 text-pink-500">My NFTs</Link>
        <Link to="/dashboard" className="mr-6 text-pink-500">Dashboard</Link>
        <Link to="/resell-nft" className="mr-6 text-pink-500">Resell NFT</Link>
      </div>
      <WalletConnect />
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-nft" element={<CreateNFT />} />
      <Route path="/my-nfts" element={<MyNFTs />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resell-nft" element={<ResellNFT />} />
    </Routes>
  </div>
  );
}

export default App;