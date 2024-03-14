import { useEffect, useState, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from "axios";
import { cryptoKaget } from 'web3/abi'

export default function Claim(p) {

    const {notif, web3, address, addressFactory, revert} = p
    async function init() {

    }
    const [code, setCode] = useState('')
    useEffect(() => {
        init()
    }, [])
    const xx = useRef()
    async function claim() {
        await xx.current.execute({ async: true })
        const token = await xx.current.getResponse()
        if (!token) {
            notif('Captcha not valid!', false)
            return
        }
        const chainId = await web3.eth.getChainId()
        const options = {
            method: 'POST',
            url: '/api/generate',
            headers: {'Content-Type': 'application/json'},
            data: {
              token,
              address,
              chainId
            }
          };
          
          const res = await axios.request(options)
          if(res.data.status) {
            const {r, s, v, expire, chain} = res.data.data
          try {
            const ca = new web3.eth.Contract(cryptoKaget, addressFactory['crpytoKaget'])
            await ca.methods.claim(expire, chain, v, r, s, code).call({from: address })
            ca.methods.claim(expire, chain, v, r, s, code).send({ from: address }).on('transactionHash', function (hash) {
                console.log(hash);
            })
                .on('receipt', function (receipt) {
                    console.log(receipt);
                })
          }catch(e) {
            notif(revert(e.message), false)
          }
          }else {
            notif(res.data.data, false)
          }
    }
    return (
        <>
            <div className="d-flex flex-column gap-4 align-items-center claim">
                <h2>Claim Ether / Token Airdrop</h2>
                <span className="detail">CryptoKaget's seamless integration of Captcha as a proof of human feature adds an extra layer of security to claim token or BNB, ensuring that only genuine human users can participate.</span>
                <input className="input-claim" placeholder="Enter Code to claim"
                    value={code} onChange={(e) => {
                        setCode(e.target.value)
                    }}
                />
                <HCaptcha
                    ref={xx}
                    id="hcaptcha-ea"
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCPHA}
                />
                <div className={`main-button c-purple`}
                    onClick={claim}>
                    <span>Claim</span>
                </div>
            </div>
        </>
    )
}