import React, { Component, useState } from 'react'
import AuthServiceAPI from '../GameAuthService/AuthServiceAPI'
import Web3 from 'web3'
const authAPI = new AuthServiceAPI();

export default class ConnectWallet extends Component {
    state = {
        address: "",
        balance: null,
        isConnected: false,
        userInfo: null,
    };

    setUserInfo = (value) => {
        this.setState({userInfo: value});
    }

    setIsConnected = (value) => {
        this.setState({isConnected: value});
    }

    accountChangedHandler = (newAccount) => {
        this.setState({address: newAccount});
    }

    setBalance = (newValue) => {
        this.setState({balance: newValue});
    }

    getUserBalance = (address) => {
        window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "lastest"]
        })
        .then((balance) => {
            this.setBalance(balance)
        })
    }

    detectCurrentProvider = () => {
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

    saveUserInfo = (ethBalance, account, chainId) => {
        const userAccount = {
            account: account,
            balance: ethBalance,
            connectionid: chainId,
        };
        window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
        const userData = JSON.parse(localStorage.getItem('userAccount'));
        this.setUserInfo(userData);
        this.setIsConnected(true);
    };

    handleConnectWallet = async () => {
        try {
            const currentProvider = this.detectCurrentProvider();
            if (currentProvider) {
              if (currentProvider !== window.ethereum) {
                console.log(
                  'Non-Ethereum browser detected. You should consider trying MetaMask!'
                );
              }
              console.log('DATTQ 1');
              currentProvider.request({ method: 'eth_requestAccounts' })
              .then(console.log('DATTQ success'))
              .catch((err) => {
                  console.error('Error : ' + err);
              });

              console.log('DATTQ 2');
              const web3 = new Web3(currentProvider);
              const userAccount = web3.eth.getAccounts();
              const chainId = web3.eth.getChainId();
              const account = userAccount[0];
              let ethBalance = web3.eth.getBalance(account); // Get wallet balance
              ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
              this.saveUserInfo(ethBalance, account, chainId);
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
        // if (window.ethereum) {
        //     window.ethereum.request({method: 'eth_requestAccounts'})
        //     .then((result) => {
        //         this.accountChangedHandler(result[0]);
        //     });

        //     this.getUserBalance(this.state.address);
        // } else {
        //     //Set error message
        //     console.error('Install Metamask');
        // }
    }

    handleDisconnectWallet = () => {
        window.localStorage.removeItem('userAccount');
        this.setUserInfo({});
        this.setIsConnected(false);
    }

    render() {
    return (
      <form>
        <h3>Connect to Wallet</h3>

        {!this.state.isConnected && (
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={this.handleConnectWallet}>
                    Connect to Wallet.
                </button>
            </div>
        )}
        
        {(
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={this.handleDisconnectWallet}>
                    Disconnect Wallet.
                </button>
            </div>
        )}
      </form>
    )
  }
}