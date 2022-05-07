import React, { useState, useEffect } from 'react'
import AuthServiceAPI from '../GameAuthService/AuthServiceAPI'
import Web3 from 'web3'
const authAPI = new AuthServiceAPI();

function ConnectWallet () {
    const [isConnected, setIsConnected] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    
    useEffect(() => {
        function checkConnectedWallet() {
            const userData = JSON.parse(localStorage.getItem('userAccount'));
            if (userData != null) {
              setUserInfo(userData);
              setIsConnected(true);
            }
        }
        checkConnectedWallet();
    }, []);

    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        } else if (window.web3) {
            provider = window.web3.currentProvider;
        } else {
            console.log(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            );
        }
        return provider;
    };

    const handleConnectWallet = async () => {
        try {
            const currentProvider = detectCurrentProvider();
            if (currentProvider) {
              if (currentProvider !== window.ethereum) {
                console.log(
                  'Non-Ethereum browser detected. You should consider trying MetaMask!'
                );
              }
              await currentProvider.request({ method: 'eth_requestAccounts' });
              const web3 = new Web3(currentProvider);
              const userAccount = await web3.eth.getAccounts();
              const chainId = await web3.eth.getChainId();
              const account = userAccount[0];
              let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
              ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
              saveUserInfo(ethBalance, account, chainId);
              if (userAccount.length === 0) {
                console.log('Please connect to meta mask');
              }
            }
          } catch (err) {
            console.log(
              'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
            );
          }
        // //var result = authAPI.signMessage(publicAddress, ip);
    };

    const handleDisconnectWallet = () => {
        window.localStorage.removeItem('userAccount');
        setUserInfo({});
        setIsConnected(false);
    };
    
    const saveUserInfo = (ethBalance, account, chainId) => {
        const userAccount = {
            account: account,
            balance: ethBalance,
            connectionid: chainId,
        };
        window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
        const userData = JSON.parse(localStorage.getItem('userAccount'));
        setUserInfo(userData);
        setIsConnected(true);
    };

    return (
      <div>
        <h3>Connect to Wallet</h3>
        {!isConnected && (
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={handleConnectWallet}>
                    Connect to Wallet.
                </button>
            </div>
        )}
        
        {isConnected && (
            <div className="d-grid">
                <button type="submit" className="btn btn-secondary" onClick={handleDisconnectWallet}>
                    Disconnect Wallet: {userInfo.account} <br/>
                    Network ID: {userInfo.connectionid} <br/>
                    Balance: {userInfo.balance} 
                </button>
            </div>
        )}
      </div>
    );
}

export default ConnectWallet;