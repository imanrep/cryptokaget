import { useEffect, useState, useRef, useId } from 'react'
import Tooltip from '@mui/material/Tooltip';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Select from "react-select";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Web3 from 'web3'
import { cryptoKaget } from 'web3/abi'
import BigNumber from 'bignumber.js';
import { Warning, BscScan } from '/comps/svg'
import Link from 'next/link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}
export default function Create(p) {

    const { chainId, notif, web3, address, addressFactory, address0, revert } = p
    const [gaType, setGaType] = useState(0)
    const [isFixed, setIsFixed] = useState(0)
    const [isWhitelist, setIsWhitelist] = useState(false)

    const [amount, setAmount] = useState()
    const [participant, setParticipant] = useState(1)
    const [utcTime, setUtcTime] = useState(0)
    const [localTime, setLocalTime] = useState()

    const [token, setToken] = useState()
    const giveAwayType = [
        { value: "ethers", label: "Ethers" },
        { value: "token", label: "Token" },
    ];

    const mode = [
        { value: "fixed", label: "Fixed" },
        { value: "random", label: "Random" },
    ];



    const participantMode = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" },
        { value: 10, label: "10" },
        { value: 11, label: "11" },
        { value: 12, label: "12" },
        { value: 13, label: "13" },
        { value: 14, label: "14" },
        { value: 15, label: "15" },
        { value: 16, label: "16" },
        { value: 17, label: "17" },
        { value: 18, label: "18" },
        { value: 19, label: "19" },
        { value: 20, label: "20" },
    ];

    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: '#39353f',
            display: "flex",
            color: 'white',
            border: 'red',
            colors: '#FFF',
            boxShadow: state.isFocused ? '0 0 0 1px #7b16fd' : '',
        }),
        option: (base, state) => ({
            ...base,
            color: "white",
            backgroundColor: state.isFocused ? '#39353f' : '#39353f',
            ':active': {
                ...base[':active'],
                backgroundColor: '#7b16fd'
            },
            ':hover': {
                ...base[':active'],
                backgroundColor: '#7b16fd5c'
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: "#fff",
            margin: '2px'
        }),
        menuList: (base) => ({
            ...base,
            background: '#39353f',
            borderRadius: '8px'
        }),
        menu: (base) => ({
            ...base,
            background: '#39353f',
            borderRadius: '8px'
        }),
    };
    const [whitelistError, setWhitelistEror] = useState([])
    const [whitelist, setWhitelist] = useState([])
    async function whitelistValidation(e) {
        const adr = e.target.value
        const web3s = new Web3()
        const addresses = adr.split("\n")
        const errors = []
        const res = []
        addresses.map((address, i) => {
            if (web3s.utils.isAddress(address)) {
                res.push(res)
            } else {
                errors.push(i + 1)
            }
        })
        setWhitelistEror(errors);
        setWhitelist(res)
    }

    async function create() {

        if (!address) {
            notif('Not Connected!', false)
            return
        }
        if (!amount || amount == 0) {
            notif('Amount invalid!', false)
            return
        }
        const ca = new web3.eth.Contract(cryptoKaget, addressFactory['crpytoKaget'])
        try {
            const tokn = gaType == 1 ? token : address0
            const totalAmount = gaType == 1 ? amount : web3.utils.toWei(amount)
            await ca.methods.createKaget(tokn, whitelist, totalAmount, isFixed == 0, utcTime, participant).call({ value: totalAmount, from: address })
            ca.methods.createKaget(tokn, whitelist, totalAmount, isFixed == 0, utcTime, participant).send({ value: totalAmount, from: address }).on('transactionHash', function (hash) {
                setConnectPopup(true)
                setTx(hash)
            })
                .on('receipt', function (receipt) {
                    setTxDone(true)
                })
        } catch (e) {
            notif(revert(e.message), false)
        }
    }
    const [isAirdropShow, setIsAirdropShow] = useState(false)
    const [airdropInfo, setAirdropInfo] = useState([])
    async function getMine() {
        try {
                const mes = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [web3.utils.sha3(address), address],
                })
            const ca = new web3.eth.Contract(cryptoKaget, addressFactory['crpytoKaget'])
            const res = await ca.methods.getPoolByAddress(mes).call({ from: address })
            setIsAirdropShow(true)
            setAirdropInfo(res)
        } catch (e) {
            notif(revert(e.message), false)
            return
        }
    }

    const [connectPopup, setConnectPopup] = useState(false)
    const [tx, setTx] = useState('0x')
    const [txDone, setTxDone] = useState(0)

    function getD(now) {
        const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
        return new Date(utc).toDateString().slice(3, new Date(utc).toDateString().length) + " " + new Date(utc).toTimeString().split(" ")[0]
    }


    return (
        <>

            <div className={`popup${connectPopup ? ' active' : ''}`}>
                <div className="blur-z"
                    onClick={() => {
                        setConnectPopup(false)
                    }}
                ></div>
                <div className="wallet-popup">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex">
                            <h3>Index Transaction</h3>
                            <h3 className='ms-auto c-pointer'
                                onClick={() => {
                                    setConnectPopup(false)
                                }}
                            >&times;</h3>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-4">
                            <img src="/img/logo_1.png" alt="logo_1" className={`spin${txDone != 0 ? ' success' : ''}`} />
                            <div className={`d-flex warning gap-2 mt-5${txDone == 1 ? ' success' : txDone == 2 ? 'failed' : ''}`}>
                                {txDone == 0 ? (
                                    <Warning className='c-warning' />
                                ) : ''}
                                <span className='align-self-center overflow-auto text-break' >{txDone == 1 ? 'Transaction Success with hash:' : txDone == 2 ? 'Your transaction failed with hash:' : 'Your transaction still indexing with hash:'} {tx}</span>
                            </div>
                            {
                                chainId == 11155111 ? (
                                    <Link href={`https://sepolia.etherscan.io/tx/${tx}`} target='_blank' className="d-flex mt-5 mx-auto gap-1">
                                        <span className='gobsc'>Go Etherscan</span>
                                        <BscScan />
                                    </Link>
                                ) : (
                                    <Link href={`https://bscscan.com/tx/${tx}`} target='_blank' className="d-flex mt-5 mx-auto gap-1">
                                        <span className='gobsc'>Go BscScan</span>
                                        <BscScan />
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column gap-4 align-items-center px-5">
                <h2 className='me-auto'>Create Ether / Token Airdrop</h2>
                <div className="d-flex w-100 gap-5 split">
                    <div className="left">
                        <div className="forms w-100 left">
                            <div className="input-form">
                                <span>Giveaway Type</span>
                                <Select instanceId={useId()} options={giveAwayType} className='select-form'
                                    styles={customStyles} defaultValue={giveAwayType[0]}
                                    onChange={(e) => {
                                        if (e.value == 'token') {
                                            setGaType(1)
                                            return
                                        }
                                        setGaType(0)
                                    }}
                                />
                            </div>

                            {gaType == 1 ? (
                                <div className="input-form">
                                    <span>Token Address</span>
                                    <input type="text" className='create-input' />
                                </div>
                            ) : ''}


                            <div className="input-form">
                                <span className='d-flex gap-2'>Mode
                                    <Tooltip title="Add" placement="right" arrow>
                                        <img src="/img/info.png" alt="info" className='info' />
                                    </Tooltip>
                                </span>
                                <Select instanceId={useId()} options={mode} className='select-form'
                                    styles={customStyles} defaultValue={mode[0]}
                                    onChange={(e) => {
                                        if (e.value == 'random') {
                                            setIsFixed(1)
                                            return
                                        }
                                        setIsFixed(0)
                                    }}
                                />
                            </div>

                            <div className="input-form">
                                <span>Amount</span>
                                <input type="number" className='create-input'
                                    onChange={(e) => {
                                        setAmount(e.target.value)
                                    }}
                                    value={amount}
                                />
                            </div>


                            <div className="input-form">
                                <span className='d-flex gap-2'>Participant
                                    <Tooltip title="Add" placement="right" arrow>
                                        <img src="/img/info.png" alt="info" className='info' />
                                    </Tooltip>
                                </span>
                                <Select instanceId={useId()} options={participantMode} className='select-form'
                                    styles={customStyles} defaultValue={participantMode[0]}
                                    onChange={(e) => {
                                        setParticipant(e.value)
                                    }}
                                />
                            </div>


                            <div className="input-form">
                                <span>Start Time (UTC)</span>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker className='date-pick'

                                        onChange={(e) => {
                                            const now = new Date(e.$d)
                                            const utc = new Date(now.getTime() - now.getTimezoneOffset() * 60000).getTime();
                                            const stringTime = new Date(now).toLocaleDateString() + " " + (new Date(now).toTimeString()).toString().split(":00 ")[0] + ":00"
                                            setLocalTime(stringTime);
                                            setUtcTime(Math.floor(utc / 1000))
                                        }} />
                                </LocalizationProvider>
                            </div>

                        </div>
                        <div className="d-flex flex-column w-100">
                            <div className="input-form">
                                <span>Add Whitelist</span>
                                <div className={`circle-option${isWhitelist ? ' active' : ''}`} onClick={() => {
                                    setIsWhitelist(!isWhitelist)
                                }}>
                                    <div className={`bubble${isWhitelist ? ' active' : ''}`}></div>
                                </div>
                            </div>
                            {isWhitelist ? (
                                <>
                                    <div className={`mb-3 error-wl${whitelistError.length ? ' active ' : ''}`}>Address invalid at line {whitelistError.join(', ')}</div>
                                    <textarea className='w-100' name="" id="" cols="30" rows="10"
                                        placeholder={`Input address such an 0x000....\n0x0000...\n0x0000...\n0x0000...`}
                                        onChange={whitelistValidation}
                                    ></textarea>
                                </>
                            ) : ''}
                        </div>
                    </div>
                    <div className="right">
                        <div className="card-overview">
                            <div className="d-flex">
                                <span>Giveaway Type</span>
                                <span className='ms-auto c-info'>{giveAwayType[gaType].label}</span>
                            </div>

                            <div className="d-flex">
                                <span>Mode</span>
                                <span className='ms-auto c-info'>{mode[isFixed].label}</span>
                            </div>

                            <div className="d-flex">
                                <span>Amount</span>
                                <span className='ms-auto c-info'>{amount ? amount : '-'} {chainId == 56 ? ' BNB' : ' ETH'}</span>
                            </div>

                            <div className="d-flex">
                                <span>Start Time</span>
                                <span className='ms-auto c-info'>{localTime ? localTime : '-'}</span>
                            </div>

                            <div className="d-flex">
                                <span>Whitelist</span>
                                <span className='ms-auto c-info'>{isWhitelist ? 'Yes' : 'No'}</span>
                            </div>

                            <div className="d-flex">
                                <span>Participant</span>
                                <span className='ms-auto c-info'>{participant}</span>
                            </div>

                            <div className="d-flex">
                                <span>Total Amount</span>
                                <span className='ms-auto c-info'>{amount ? isFixed == 0 ? amount * participant : amount : '-'}
                                    {chainId == 56 ? ' BNB' : ' ETH'}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="me-auto">
                    <div className="main-button c-purple"
                        onClick={create}
                    >Create</div>
                </div>
                <h2>My Airdrop</h2>
                <div className="">
                    <div className="main-button c-purple"
                        onClick={getMine}
                    >Show my Airdrop</div>
                </div>
                {isAirdropShow ? (
                    <TableContainer component={Paper} className='table-airdrop'>
                        <Table sx={{ minWidth: 650 }} >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key ID</TableCell>
                                    <TableCell align="right">Start</TableCell>
                                    <TableCell align="right">Participant</TableCell>
                                    <TableCell align="right">Whitelist</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Claimed</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {airdropInfo.map((row, i) => (
                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.uid}
                                        </TableCell>
                                        <TableCell align="right">{getD(new Date(row.startTime * 1000))}</TableCell>
                                        <TableCell align="right">{row.participant}</TableCell>
                                        <TableCell align="right">{row.whitelist.length ? 'Yes' : 'No'}</TableCell>
                                        <TableCell align="right">{row.amount / 10 ** row.decimals}</TableCell>
                                        <TableCell align="right">{row.userClaim.length}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
                    : ''}
            </div>
        </>
    )
}