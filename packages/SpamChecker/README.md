# SpamChecker
## 使い方
```js
const {Client} = require("himaque-api")
const client = new Client({
  options: [
    //...
  ]
})
const SC = require("@himaque-api/SpamChecker")
const sc = new SC({
  client,
  maxCount: 10 //指定時間内にこの回数以上の発言をするとスパム判定をする
  reserInterval: 10000 //この時間で指定回数以上の発言をするとスパム判定になる
})

client.on("ready", () => {
  sc.startCheck("AreaMessage")
  sc.startCheck("GuildMessage")
  sc.startCheck("DirectMessage")
})

sc.once("AreaSpam", (message) => {
  console.log(message) //スパム対象のメッセージを受け取る
})

sc.on("GuildSpam", (message) => {
  client.ignores.add(message.author)
})

sc.on("DirectSpam", (message) => {
  sc.endCheck("DirectMessage")
})
```
