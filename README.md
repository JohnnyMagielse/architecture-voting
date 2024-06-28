# blockchain-architecture-e-voting

## Requirements
- Docker
- CURL
  
## Guides

### How to test the contract
```bash
# First start/deploy the network and contracts
cd chaincode
npm install --include=dev
npm test
```

### How to install hyperledger
```bash
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
./install-fabric.sh docker samples binary # Install docker, binaries, and fabric samples
```

### How to deploy the hyperledger network
```bash
# Install hyperledger
cd fabric-samples/test-network
./network.sh up createChannel -c hvachannel -ca # Start network
./network.sh deployCC -ccn acc-mgmt -ccp ../../chaincode -ccv 1 -ccl javascript -c hvachannel # Deploy contract
cd ../../backend
# Add the required user/admin users to the organization
node enrollAdmin.js
node registerUser.js
```

### How to start the hyperledger network after stopped
```bash
cd fabric-samples/test-network
./network.sh up
```

### How to run the backend
```bash
# First start/deploy the network and contracts
sh backendBuild.sh
```

### How to set a referendum question 
```bash
# First start/deploy the network and contracts
cd backend
node createVote.js Question here
```

### How to stop the network
```bash
cd fabric-samples/test-network
./network.sh down
```

## Issues:
- **[!] Failed to register user "appUser": Error: fabric-ca request register failed with errors ... "Identity 'appUser' is already registered** - Reset the network by stopping it and starting it again.
- **Error: DiscoveryService: hvachannel error: access denied** - Delete the files in client/e-voting-blockchain-arc/wallet and rerun the enrollAdmin.js and registerUser.js