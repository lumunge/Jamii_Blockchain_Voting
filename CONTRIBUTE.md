# `Jamii Ballots - Secure blockchain voting`

A voting system that leverages the blockchain to deliver secure and transparent ballots.

## Development Guide

The following guide serves to get anyone started in contributing to Jamii Ballots.

### Prerequisites:

The following need to be installed;

[Brownie](https://eth-brownie.readthedocs.io/en/stable/install.html) - a python-based development and testing framework for smart contracts that target the EVM.

[Ganache CLI](https://www.npmjs.com/package/ganache-cli) - a personal blockchain for rapid Ethereum decentralized application development.

Make sure to have a ESlint and Prettier plugins are installed to check for code-smells and auto-formatting.

### Step 1: Clone Jamii Ballots

```
git clone https://github.com/lumunge/Jamii_Blockchain_Voting.git
```

### Step 2: Create a Local Ganache Test Network:

```
$ brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
```

### Step 3: Start Local Ganache Blockchain in a New Terminal:

```
$ ganache-cli
```

### Step 4: Contract Deployment:

First, we can delete the pre-existing contract ABIs and have a new fresh deployment to mess with. For this we delete the _build_ folder in the project root directory and the build folder located in the _client/build_ directory. If you cloned the project, then the former should NOT exist.

```
$ rm -rf build client/build
```

#### 4.1: Setup .env file

Paste the following in the .env file;

```
PRIVATE_KEY_1="super secret private key
KOVAN_INFURA_URL="secret kovan infura url"
RINKEBY_INFURA_URL="secret rinkeby infura url"
GOERLI_INFURA_URL="secret goerli infura url"
```

We can get url + keys from [infura](https://infura.io/)

_PRIVATE_KEY_1_ is the private key obtained from a meta mask wallet. It is the key that will sign the transactions to deploy the contract. It should have enough Goerli, Kovan, or Rinkaby test Eth(funds) to deploy the contract.
This should be kept secure and private in the .env file which should NOT be pushed to any public repo.

#### 4.2: deploy contracts.

To deploy contracts to _Kovan_, _Rinkeby_, _Goerli_ live test networks, we perform the following actions;

**Goerli**

```shell
$ brownie run scripts/script_factory --network goerli
```

**Kovan**

```shell
$ brownie run scripts/script_factory --network kovan
```

**Rinkeby**

```shell
$ brownie run scripts/script_factory --network rinkeby
```

**Local**

```shell
$ brownie run scripts/script_factory --network ganache-local
```

**Development**

```shell
$ brownie run scripts/script_factory --network development
```

#### Note

Before running the above last two commands to deploy to local ganache, make sure ganache CLI or ganache UI is online.

#### 4.3: Update contract deployments.

After deploying the contracts to the respective test networks, we should have a newly generated build folder with the new contract ABIs and deployment addresses in the respective text networks.
We copy the build folder to the _client/build_ directory;

```
$ cp -r build client/build
```

### Step 5: Install Client Packages:

We install all the front-end packages by navigating to the client directory and running _npm install_ as shown below;

```
$ cd Jamii_Blockchain_Voting/client; npm install;
```

### Step 6: Start client:

To start the client our current working directory should be 'Jamii_Blockchain_Voting/client'. So we run the following command to start the local dev client and server;

```
$ npm run dev
```

## Video Demonstrations:

## Need help?

If you need help with setting up the project locally for development or have other questions - don't hesitate to write me @ lumungep12@gmail.com

### Pull Requests

1. Fork the repo and create your branch from `master`.
2. Make sure your code lints and is correctly formatted.

### Known Issues

We use GitHub issues to track public bugs, although we will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new issue, try to make sure your problem doesn't already exist.

### Coding Style

Please follow the [Coding Style](https://github.com/lumunge/Jamii_Blockchain_Voting/blob/master/CODING_STYLE.md) documentation.

## License

By contributing to the Jamii ballots, you agree that your contributions will be licensed under its license.
