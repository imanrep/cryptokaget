import Flow from "@/comps/Flow"
import { useState } from "react"

export default function Home() {

  const [step, setStep] = useState(0)

  const tSTep = [
    {
      title : 'Create',
      sub : 'Submit amount, method or any tokens / ethers you want to share'
    },
    {
      title : 'Share',
      sub : 'Share the key after you set the time, so everyone can claim it'
    },
    {
      title : 'Claim',
      sub : 'Submit the key and claim wheter fixed amount or random amount. Enjoy'
    }
  ]
  return (
    <>
      <div className="homes">
        <div className="container-fluid py-5 w-100">
          <div className="d-flex main-home pt-5">
            <div className="main-home_left">
              <div className="main-home_text d-flex flex-column gap-3">
                <h1>Share your funds around the world with one click safely</h1>
                <span>Protect your Airdrops from bots and "fair claim" with Proof of Human</span>
                <div className="d-flex gap-2">
                  <div className="main-button c-purple">Create</div>
                  <div className="main-button">Claim</div>
                </div>
              </div>
            </div>
            <div className="main-home_right">
              <img src="/img/circle.png" alt="Circle" />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column">
        <h1 className="text-center mb-5">Bots are not count anymore</h1>
        <Flow />
        <h2 className="text-center mt-5">Simple steps to join the journey!</h2>
       <div className="d-flex gap-5 justify-content-center mt-5">
        {tSTep.map((row,i) => (
          <div className={`d-flex gap-2 c-pointer stepq flex-column${step == i ? ' selected' : ''}`} onClick={() => setStep(i)} key={i}>
          <div className={`bar${step == i ? ' selected' : ''}`}></div>
          <div className="num mb-3">0{i+1}</div>
          <div className="d-flex gap-2 flex-column">
          <div className={`title`}>{row.title}</div>
          {step == i ? (
            <div className="sub-t">{row.sub}</div>
          ) : ''}
          </div>
        </div>
        ))}
       </div>
      </div>

      <div className="d-flex flex-column mt-5">
        <h1 className="text-center">Fair share with CryptoKaget</h1>
        <span className="text-center mt-2">Claimers can claim funds based on fixed or random amount</span>
        <div className="d-flex az flex-wrap gap-3 justify-content-center px-5 mt-5">
          <div className="box-content">
            <div className="title">Fixed Amount</div>
            <div className="sub">Fixed amount will share funds with amount / participant. So everyone will get equal amount. </div>
          </div>
          <div className="box-content">
            <div className="title">Random Amount</div>
            <div className="sub">Each claimers will receive funds randomly until total participant met the max. This one need your little luck</div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <div className="main-button c-purple">Create now</div>
        </div>
        </div>
        <div className="d-flex flex-column mt-5">
        <h1 className="text-center">Chains We Support</h1>
        <h2 className="text-center mt-2">CryptoKaget provide multi-chain platform to make sharing easily</h2>
          <div className="wrapper">
          <div className="d-inline-block w-100">
              <div className="pix-img-el text-center d-inline-block layer2 w-100 rounded-0">
                <img src="/img/circle-chain-2.svg" alt="c1" />
              </div>
            </div>
            <div className="d-inline-block w-100">
              <div className="pix-img-el text-center d-inline-block layer1 w-100 rounded-0">
                <img src="/img/logo.svg" alt="c3" />
              </div>
            </div>
            <div className="d-inline-block w-100">
              <div className="pix-img-el text-center d-inline-block layer2 w-100 rounded-0">
                <img src="/img/circle-chain.svg" alt="c2" />
              </div>
            </div>

          </div>
        </div>
    </>
  )
}
