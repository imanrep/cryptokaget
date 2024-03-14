import { useRouter } from "next/router"
import Link from "next/link"
import {Warning} from 'comps/svg'

export default function Header(p) {
    const router = useRouter()

    const { setConnectPopup, address, blurAddress, chainId } = p
    return (
        <>
            <div className="header">
                <div className="d-flex hh justify-content-between py-3 px-5 align-items-center">
                    <div className="d-flex gap-2">
                        <img src="/img/logo.png" alt="Logo" className="logo" />
                        <span className="logo-title align-self-center">CryptoKaget</span>
                    </div>
                    <div className="d-flex gap-3 menus">
                        <span className={router.asPath == '/' ? 'active' : ''} >
                            <Link href={'/'}>Home</Link>
                        </span>
                        <span className={router.asPath == '/create' ? 'active' : ''}>
                            <Link href={'/create'}>Create</Link>
                        </span>
                        <span className={router.asPath == '/claim' ? 'active' : ''}>
                            <Link href={'/claim'}>Claim</Link>
                        </span>
                    </div>

                    <div className="d-flex gap-3 ">
                        <div className="main-button docs">
                            <span>Docs</span>
                        </div>
                        <div className="main-button c-purple" onClick={() => { setConnectPopup(true) }}>
                            <div className="d-flex gap-2">
                                {chainId != 56 && chainId != 11155111 && address ? (
                                    <Warning className='align-self-center c-warning' />
                                ) : ''}
                                <span className='align-self-center'>
                                    {blurAddress ? blurAddress : 'Connect Wallet'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}