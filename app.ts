import express from 'express'
import { Connection, PublicKey } from '@solana/web3.js'
import dotenv from 'dotenv'

// load environment variables
dotenv.config()


// express parameters
const PORT = process.env.PORT || 8080;
const app = express();

// Solana config
const connection: string | Connection = new Connection(process.env.SOLANA_URL!, 'confirmed');
const programId: PublicKey = new PublicKey(process.env.PROGRAM_ID!);

// express middleware
app.use(express.json())

// CORS config
app.use(function (_, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Origin', '*')
  res.setHeader('Content-Type', 'Application/json')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

app.get('/', (_, res) => {
  res.send('Please got to /nfts')
  res.end()
})

// gget endpoint for /nfts route
app.get('/nfts', async (_, res) => {
  try {
    const accounts = await connection.getProgramAccounts(programId);
    const nfts = accounts.map((account) => ({
      pubkey: account.pubkey.toBase58(),
      metadata: account.account.data.toString(),
    }));
    res.json(nfts)
    res.end()
  } catch (error: any ) {
    res.status(500).send(error.toString())
    res.end()
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})