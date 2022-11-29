import React, {useEffect, useState} from 'react';
import { Button, Tabs, Tab, Container, Nav, Navbar, Form, Modal, ModalDialog } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import FungeAbi from './abi/Funge.json';
import env from 'react-dotenv';
import axios, {isCancel, AxiosError} from 'axios'

//Uniswap V3 library imports
import { Pool } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'


function App() {
  
  const [currentAccount, setAccount] = useState();
  const [currentAccountBalance, setAccountBalance] = useState();
  const [networkId, setNetworkId] = useState();
  const [fungeToken, setFungeInstance] = useState();
  const [fungeTokenBalance, setFungeTokenBalance] = useState();
  const [mintReceiverAddress, setMintReceiverAddress] = useState();
  const [mintReceiveAmount, setMintReceiveAmount] = useState();
  const [sendReceiverAddress, setSendReceiverAddress] = useState();
  const [sendReceiveAmount, setSendReceiveAmount] = useState();
  const [walletFungeBalance, setWalletFungeBalance] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //Goerli Funge Token non ERC20 compatible
  const [FungeAddress, setFungeAddress] = useState("0xed6d5F6c14D9863150845404Db81F8f9c13946eD")
  //Goerli Funge Token ERC20 compatible
  const [FungeTokenAddress, setFungeTokenAddress] = useState("0xf21931d82E7891E1b497ec7EDfadAefb63C9C195");
  const [EtherscanApiKey, setEtherscanApiKey] = useState("5DUVJVCHHYRW525JBHKD2CVVB8D6HQIP88")
  const [txhash, setTxHash] = useState();
  const [walletTx, setWalletTx] = useState();
  const goerli_contract_address = {
    "usdc": "0xde637d4c445ca2aae8f782ffac8d2971b93a4998",
    "dai": "0xdc31ee1784292379fbb2964b3b9c4124d8f89c60"
  }
  

  const loadWeb3 = async() => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }
    else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Please install metamask')
    }
  }
  

  const loadWalletData = async() => {
    const web3 = window.web3
    let _networkid = await web3.eth.net.getId();
    setNetworkId(_networkid)
    const account = await web3.eth.getAccounts();
    setAccount(account[0]);
    let _balance = await web3.eth.getBalance(currentAccount)
    //convert balance from wei to ether
    let balance = await web3.utils.fromWei(_balance, "ether");
    setAccountBalance(balance);
  }

  const getFungeTokenBalance = async() => {
    var web3 = new Web3(Web3.givenProvider);
    var _fungeInstance = new web3.eth.Contract(FungeAbi, FungeAddress)
    
    let bal = await _fungeInstance.methods.balances(walletFungeBalance).call();
    setFungeTokenBalance(bal);
    handleShow();
  }

  const mintFungeToken = async(e) => {
    var web3 = new Web3(Web3.givenProvider);
    var _fungeInstance = new web3.eth.Contract(FungeAbi, FungeAddress, {
      from: currentAccount, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    })
    let mintResult = await _fungeInstance.methods.mint(mintReceiverAddress, mintReceiveAmount)
    .send({from: currentAccount}); //mint 1M
    let j = JSON.parse(mintResult)
  }

  const sendFungeToken = async(e) => {
    var web3 = new Web3(Web3.givenProvider);
    var _fungeInstance = new web3.eth.Contract(FungeAbi, FungeAddress, {
      from: currentAccount, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    })

    let sendResult = await _fungeInstance.methods.send(sendReceiverAddress, sendReceiveAmount)
    .send({from: currentAccount});

  }

  const getWalletTransactionHistory = async(e) => {
    console.log(`walletTx ${walletTx}`)
    const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${walletTx}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${EtherscanApiKey}`
    axios.get(url)
    .then(response => {
      console.log(`hash ${response.data.result[0].hash}`);
      setTxHash(response.data.result[0].hash)
    })
    .catch(error => {
      console.log(error);
    })
  }

  /*** Uniswap V3 Staking and Liquidity Pool **/
  const createPool = async(e) => {
    const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8';
    var web3 = new Web3(Web3.givenProvider);
    /*const poolContract = new web3.eth.Contract(abi, poolAddress, {
      from: currentAccount, // default from address
      gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });*/

  }
  
  const stakeFunge = async(e) => {
    alert('Staking Funge Token');
  }

  /*** Uniswap V3 Staking and Liquidity Pool **/

  useEffect(() => {
    //setup to connect to Metamask wallet or other wallet provider
    loadWeb3();
    //by calling getAccounts, we will know if we are connected to metamask
    loadWalletData();
  })

  return (
    <div className="App">
      <header className="App-header">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Wallet Address: {currentAccount}</Navbar.Brand>
            <Navbar.Brand>Wallet ETH Balance: {currentAccountBalance}</Navbar.Brand>
          </Container>
        </Navbar>
      </header>
      <Tabs
        defaultActiveKey="FungeControls"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="FungeControls" title="Funge Controls">
        <div style={{backgroundColor:'lightskyblue', padding:"20px"}}>
            <Form.Group className='mb-3' id="mint">

              <Form.Label>Mint Funge Token</Form.Label>
              <Form.Control placeholder='Receiver Address' onChange={(e) => setMintReceiverAddress(e.target.value)}/>
              <Form.Control placeholder='Amount to mint' onChange={(e) => setMintReceiveAmount(e.target.value)}/>

            </Form.Group>
            <Button variant="primary" onClick={(e) => mintFungeToken(e)}>Mint Funge</Button>
          </div>
          <div style={{backgroundColor:'lightblue', padding:"20px"}}>
            <Form.Group className='mb-3' id="mint">

              <Form.Label>Send Funge Token</Form.Label>
              <Form.Control placeholder='Receiver Address' onChange={(e) => setSendReceiverAddress(e.target.value)}/>
              <Form.Control placeholder='Amount to send' onChange={(e) => setSendReceiveAmount(e.target.value)}/>

            </Form.Group>
            <Button variant="primary" onClick={(e) => sendFungeToken(e)}>Send Funge</Button>
          </div>
        </Tab>
        <Tab eventKey="Funge Explorer" title="Funge Explorer">
          <h1>Funge Token Explorer</h1>
          <div style={{backgroundColor:'lightblue', padding:"20px"}}>
            <Form.Group className='mb-3' id="balance">

              <Form.Label>Check Funge Balance</Form.Label>
              <Form.Control placeholder='Wallet Address' onChange={(e) => {setWalletFungeBalance(e.target.value)}}/>
              
            </Form.Group>
            <Button variant="primary" onClick={(e) => getFungeTokenBalance(e)}>Funge Balance</Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Wallet {walletFungeBalance}</Modal.Title>
              </Modal.Header>
              <Modal.Body>Funge Token Balance {fungeTokenBalance}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
          <div style={{backgroundColor:'lightgrey', padding:"20px"}}>
            <Form.Group className='mb-3' id="txhistory">

              <Form.Label>Get Transaction History</Form.Label>
              <Form.Control placeholder='Wallet Address' onChange={(e) => {setWalletTx(e.target.value)}}/>
              <Form.Label>Tx Hash {txhash}</Form.Label>

            </Form.Group>
            <Button variant="primary" onClick={(e) => getWalletTransactionHistory(e)}>Get Tx History</Button>
            
          </div>
        </Tab>
        <Tab eventKey="FungeStaking" title="Funge Token Staking">
          <h1>Stake Token</h1>
          <Button variant="primary" onClick={(e) => stakeFunge(e)} style={{padding:"20px"}}>Stake Token</Button>
        </Tab>
        <Tab eventKey="UniswapV3Staking" title="Uniswap V3 Staking">
          <h1>Uniswap Liquidity Pool</h1>
          <Button variant="primary" onClick={(e) => createPool(e)} style={{padding:"20px"}}>Create Pool</Button>
        </Tab>
      </Tabs>

      
    </div>
  );
}

export default App;
