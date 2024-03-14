import '@/styles/globals.css'
import '@/styles/boots.css'
import Header from '/comps/Header'
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3'
import { Warning, BscScan } from 'comps/svg'
import Link from 'next/link';
import { useRouter } from 'next/router';
export default function App(p) {
  const { Component } = p;
  const router = useRouter()
  const [address, setAddress] = useState()
  const [blurAddress, setBlurAddress] = useState()
  const [web3, setWeb3] = useState()
  const [connectPopup, setConnectPopup] = useState(false)
  const [chainId, setChainId] = useState(0)
  const [balance, setBalance] = useState(0)

  const wallet = [
    {
      wallet: 'Metamask',
      img: 'metamask.png'
    },
    {
      wallet: 'Wallet Connect',
      img: 'wc.png'
    },
    {
      wallet: 'Coinbase',
      img: 'cb.png'
    },
    {
      wallet: 'Binance',
      img: 'binance.png'
    }
  ]
  const notif = (message, isSuccess) => {
    toast(message, { hideProgressBar: true, autoClose: 3000, type: isSuccess ? 'success' : 'error', className: "toast-cryptokaget" })
  }

  async function init() {
    const isConnected = await ethereum.request({ method: 'eth_accounts' })
    if (isConnected.length) {
      const addr = isConnected[0]
      setAddress(addr)
      setBlurAddress(addr.slice(0, 6) + "..." + addr.slice(addr.length - 6, addr.length))
      const web3s = new Web3(ethereum)
      web3s.eth.handleRevert = true
      setWeb3(web3s)
      setChainId(await web3s.eth.getChainId())
      const balance = await web3s.eth.getBalance(addr)
      setBalance(String(+(balance) / 1e18).slice(0, 5))
    }
  }


  useEffect(() => {
    init()
  }, [])
  async function connectWallet(wallet) {

    async function connectWallet() {
      try {
        const connect = await window.ethereum.request({ method: "eth_requestAccounts" });
        const addr = connect[0]
        setAddress(addr)
        setBlurAddress(addr.slice(0, 6) + "..." + addr.slice(addr.length - 6, addr.length))
        const web3s = new Web3(ethereum)
        web3s.eth.handleRevert = true
        setWeb3(web3s)
        setChainId(await web3s.eth.getChainId())
        const balance = await web3s.eth.getBalance(addr)
        setBalance(String(+(balance) / 1e18).slice(0, 5))
      } catch (e) {
        notif(e.message)
      }
    }

    switch (wallet) {
      case 'Metamask':
        if (!(await window.ethereum.isMetaMask)) {
          notif('Metamask Wallet not found!')
          return
        }
        await connectWallet()
        return
      case 'Wallet Connect':
        try {
          const { default: WalletConnectProvider } = await import(
            "@walletconnect/web3-provider"
          );
          const walletConnectProvider = new WalletConnectProvider({
            chainId: 1,
            rpc: {
              1: "https://eth.rpc.blxrbdn.com",
            },
          });
          await walletConnectProvider.enable();
          const web3s = new Web3(walletConnectProvider)
          web3s.eth.handleRevert = true
          const addr = (await web3s.eth.getAccounts())[0]
          setAddress(addr)
          setBlurAddress(addr.slice(0, 4) + "..." + addr.slice(addr.length - 4, addr.length))
          setWeb3(web3s)
          setChainId(await web3s.eth.getChainId())
          const balance = await web3s.eth.getBalance(addr)
          setBalance(String(+(balance) / 1e18).slice(0, 5))
        } catch (e) {
          notif('User closed modal', false)
        }
        return
      case 'Coinbase':
        if (!(await window.ethereum.isCoinbaseWallet)) {
          notif('Coinbase Wallet not found!')
          return
        }
        return
      case 'Binance':
        if (!(await window.BinanceChain)) {
          notif('Binance Wallet not found!')
          return
        }
        return
    }
  }

  const addressFactory = {
    crpytoKaget: '0x8a1b8EC4F3cfb672243E7cbE634FF92FA231c51c',
    kumahaCatpcha: "0x6F3602575E19B9BbDDD3E678F783b248817f5005"

  }
  const address0 = '0x0000000000000000000000000000000000000000'

  function revert(mes) {
    if(mes.includes("Your request got reverted with the following reason string:")) {
      const res =  (mes.split("Your request got reverted with the following reason string:")[1])
      return res
    }else {
      return mes
    }
  }
  p = {
    ...p,
    revert,
    setConnectPopup,
    address,
    notif,
    web3,
    blurAddress,
    chainId,
    addressFactory,
    address0
  }
  return (
    <>
      {address ? (
        <div className={`popup${connectPopup ? ' active' : ''}`}>
          <div className="blur-z"
            onClick={() => {
              setConnectPopup(false)
            }}
          ></div>
          <div className="wallet-popup">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex">
                <h3>Your Wallet</h3>
                <h3 className='ms-auto c-pointer'
                  onClick={() => {
                    setConnectPopup(false)
                  }}
                >&times;</h3>
              </div>
              <div className="d-flex flex-column gap-2">
                <span className='title'>Your Address (click to copy) </span>
                <input type="text" value={address} readOnly
                  onClick={() => {
                    navigator.clipboard.writeText(address)
                    notif('Copy successful', true)
                  }}
                />
                {chainId != 11155111 && chainId != 56 ? (
                  <div className="d-flex warning gap-2 mt-2">
                    <Warning className='c-warning' />
                    <span className='align-self-center'>Your wallet is not connected to Binance Chain or SepoliaETH! Please change on your wallet</span>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2 mt-2">
                    <div className="d-flex align-items-center">
                      <div className='top-title d-flex align-items-center gap-2'>
                        {chainId != 11155111 ? (
                          <>
                            <img src="/img/97.png" alt="Binance" />
                            <span>Binance Smart Chain</span>
                          </>
                        ) : (
                        <>
                          <img src="/img/97.png" alt="Binance" />
                          <span>Sepholia Testnet</span>
                        </>
                        )}

                      </div>
                      {chainId != 11155111 ? (
                        <Link href={`https://bscscan.com/address/${address}`} target='_blank' className="d-flex ms-auto gap-1">
                          <span className='gobsc'>BscScan</span>
                          <BscScan />
                        </Link>
                      ) : (
                        <Link href={`https://sepolia.etherscan.io/address/${address}`} target='_blank' className="d-flex ms-auto gap-1">
                        <span className='gobsc'>Etherscan</span>
                        <BscScan />
                      </Link>
                      )
                      }

                    </div>
                    <div className="d-flex">
                      <span>{chainId == 11155111 ? 'ETH ' : 'BNB '} Balance</span>
                      <span className='ms-auto'>{balance}</span>
                    </div>
                  </div>
                )}
                <div className="main-button c-purple w-50 text-center mt-5"
                  onClick={() => {
                    setAddress()
                    setBlurAddress()
                    setWeb3()
                    setChainId()
                  }}
                >Disconnect</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`popup${connectPopup ? ' active' : ''}`}>
          <div className="blur-z"
            onClick={() => {
              setConnectPopup(false)
            }}
          ></div>
          <div className="wallet-popup">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex">
                <h3>Select a Wallet</h3>
                <h3 className='ms-auto c-pointer'
                  onClick={() => {
                    setConnectPopup(false)
                  }}
                >&times;</h3>
              </div>
              <span className='text-gray-3'>Please select a wallet to connect CryptoKaget</span>
              <div className="py-3 px-3 d-flex flex-wrap gap-4">
                {wallet.map((data, i) => (
                  <div className="wallet-content" key={i} onClick={() => {
                    connectWallet(data.wallet)
                  }}>
                    <img src={`/img/${data.img}`} alt={data.wallet} />
                    <span>{data.wallet}</span>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      )}
      <Header {...p} />
      <div className={`main${router.asPath == '/' ? ' home' : ''}`}>
        <Component {...p} />
        <ToastContainer />
      </div>
    </>

  )
}


