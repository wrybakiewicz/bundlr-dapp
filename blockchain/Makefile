.PHONY: test

compile:
	npx hardhat compile

test:
	npx hardhat test

node:
	npx hardhat node --no-deploy --hostname 0.0.0.0

deploy_local:
	npx hardhat deploy --network localhost

install:
	npm install

deploy_matic:
	npx hardhat deploy --network matic

deploy_boba:
	npx hardhat deploy --network boba