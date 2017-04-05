# internlens-server ![](https://circleci.com/gh/internlens-tw/internlens-server.svg?style=shield&circle-token=4bca29994b0561b624837dea78c99680591d8086)

Node.js backend server for internlens API.

## Installation

### Dependencies

1. mongoDB
2. Node.js (Recommend: install by [nvm](https://github.com/creationix/nvm))

### Installation Steps

```bash
cp config.js.example config.js
vim config.js  # Fill in the blanks
ssh-keygen -f rsa.private && ssh-keygen -e -m PEM -f rsa.private.pub > rsa.public && rm rsa.private.pub
npm install
```

## Execution

```bash
npm start
```

