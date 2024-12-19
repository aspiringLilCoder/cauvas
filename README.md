## Week 5: 🎰 Lottery
---

## 📍 Contract Addresses: 
**LotteryToken:** 0x9753B6B09baD918F42dA8E86948CaD7C7EE229A1 ([Etherscan Link](https://sepolia.etherscan.io/address/0x9753B6B09baD918F42dA8E86948CaD7C7EE229A1))
<br><br>
**Lottery:** 0x250B72f4fB36729513fE68D2b77B16aBa12f2F72 ([Etherscan Link](https://sepolia.etherscan.io/address/0x250B72f4fB36729513fE68D2b77B16aBa12f2F72))

---
##  📸 Frontend screenshots: 
![image](https://github.com/user-attachments/assets/e34cf583-8db2-4c25-a027-e352f371bd6c)

![image](https://github.com/user-attachments/assets/fb05e82b-3c00-4ccc-810b-813a0d6a1ae1)

After bets are open & a bet has been placed:

<img src="https://github.com/user-attachments/assets/92a4dc4f-cb5d-4258-83fd-9a610ec505c3"  width="500"/>

---

## 🧑‍💻Team members:

We refer the members by their discord display name for simplicity.

| ID    |  Discord Username   |
|---------|-------------------|
| 6mzqes | @gleb       |
| yzw5TZ | @cherry        |

---

### Set up instructions for Group Members:
### 1. 
```sh
git clone https://github.com/Group-10-Weekly-Assignments-Encode-Club-EVM-Bootcamp-Q4-2024.git
cd Group-10-Weekly-Assignments-Encode-Club-EVM-Bootcamp-Q4-2024
git checkout Week-5
```
### 2. create and fill in the following '*.env*' file in the '*frontend/packages/hardhat*', and '*frontend/packages/nextjs*' folders
```env
PRIVATE_KEY="<your wallet private key should go here>"
DEPLOYER_PRIVATE_KEY="<your wallet private key should go here>"
ALCHEMY_API_KEY="********************************"
ETHERSCAN_API_KEY="********************************"
```
### 3. start the frontend

* **first terminal:**
```sh
cd frontend/scaffold-eth-2/
yarn install
yarn chain
```

* **second terminal:**
```sh
cd frontend/scaffold-eth-2/
yarn start
```
* Access frontend through `http://localhost:3000/`.
* Access the Lottery contract through `http://localhost:3000/debug`.

### 4. start editing the components in '*frontend/packages/nextjs/app/components*' commit changes!


