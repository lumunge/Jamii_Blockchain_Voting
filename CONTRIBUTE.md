# `Jamii Ballots - Secure blockchain voting`

A voting system that leverages the blockhain to deliver secure and transparent ballots.

## Development Guide

The following guide serves to get anyone started in contributing to Jamii Ballots.

### Prerequisites:

The following need to be installed;

[Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html)
[Ganache CLI](https://www.npmjs.com/package/ganache-cli)

### Step 1: Clone Jamii Ballots

git clone https://github.com/lumunge/Jamii_Blockchain_Voting.git

### Step 2: Create local ganache network:

```
$ brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
```

### Step 3: Start local Ganache blockchain in new terminal:

```
$ ganache-cli
```

### Step 4: Contract Deployment

First we can delete the pre-existing contract ABIs and have a new frsh deployment to mess with. For this we delete the _build_ folder in the project root directory and the build folder located in the _client/build_ directory. If you cloned the project, then the former should NOT exist.

```
$ rm -rf build client/build
```

#### 4.1: Setup .env file.

Paste the following in the .env file;

```
PRIVATE_KEY_1="super secret private key
KOVAN_INFURA_URL="secret kovan infura url"
RINKEBY_INFURA_URL="secret rinkeby infura url"
GOERLI_INFURA_URL="secret goerli infura url"
```

We can get url + keys from [infura](https://infura.io/)

_PRIVATE_KEY_1_ is the private key obtained from a metamask wallet. It is the key that will sign the transactions to deploy the contract. It should have enough Goerli, Kovan or Rinkaby test Eth(funds) to deploy the contract.
This should be kept secure and private in the .env file which should NOT be pushed to any public repo.

#### 4.2: deploy contracts.

To deploy contracts to _Kovan_, _Rinkeby_, _Goerli_ live test networks, we perform the following actions;

**Goerli** brownie run scripts/script_factory --network goerli
**Kovan** brownie run scripts/script_factory --network kovan
**Rinkeby** brownie run scripts/script_factory --network rinkeby
**Local** brownie run scripts/script_factory --network ganache-local
**Development** brownie run scripts/script_factory --network development

#### Note

Before running the above last two commands to deploy to local ganache, make sure ganache-cli or ganache UI is oline.

#### 4.2: Update contract deployments.

After deploying the contracts to the respective test networks, we should have a newly generated build folder with the new contracts abis and deployment addresses in the respective text networks.
We copy the build folder to the _client/build_ directory;

```
$ cp -r build client/build
```

### Step 5: Install Client Packages:

We install all the front end packages by navigating to the client directory and running _npm install_ as shown below;

```
$ cd Jamii_Blockchain_Voting/client; npm install;
```

### Step 6: Start client:

To start the client our current working directory should be 'Jamii_Blockchain_Voting/client'. So we run the follwoing command to start the local dev client and server;

```
$ npm run dev
```

## Video Demonstrations:
