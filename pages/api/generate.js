import { ethers } from 'ethers'
import hcaptcha from 'hcaptcha';

export default async function handler(req, res) {
  const hcaptchaSecret = process.env.SECERET_HCAPTCHA
  if (req.method == 'GET') {
    res.status(200).json('METHOD /GET NOT FOUND')
    return
  }
  const { token, address, chainId } = req.body
  if (!token) {
    res.status(200).json({ status: false, data: 'Token not found' })
    return
  }
  if (!address) {
    res.status(200).json({ status: false, data: 'address not found' })
    return
  }

  if (!chainId) {
    res.status(200).json({ status: false, data: 'ChainId not found' })
    return
  }
  const { success, challenge_ts } = await hcaptcha.verify(hcaptchaSecret, token);
  const ts = new Date(challenge_ts).getTime() - 125000
  if(ts > new Date().getTime() + 5000) {
    res.status(200).json({status :false, data :
  'Captcha expired'
    })
    return
  }
  if (!success) {
    res.status(200).json({ status: false, data: 'Captcha may expire or invalid' })
    return
  }
  const wallet = new ethers.Wallet('83877aae6a14bf98fbaf703014898def565f75c8f2b41e8786e0bdec4c50bbb0');
  const ex = Math.floor((new Date().getTime() / 1000) + 20)
  const expire = ethers.utils.hexZeroPad(
    ethers.utils.hexlify(
      ex
    ),
    4
  );
  const chain = ethers.utils.hexZeroPad(
    ethers.utils.hexlify(chainId), 4
  );

  const hash = ethers.utils.keccak256(
    ethers.utils.hexConcat([address, expire, chain])
  );

  const validatorSignature = await wallet.signMessage(
    ethers.utils.arrayify(hash)
  );
  const v = ethers.utils.hexDataSlice(validatorSignature, 64, 65)
  const r = ethers.utils.hexDataSlice(validatorSignature, 0, 32)
  const s = ethers.utils.hexDataSlice(validatorSignature, 32, 64)
  res.status(200).json({status :true, data :
  { 
    expire,
    chain,
    v,
    r,
    s,
   }
  })
}
