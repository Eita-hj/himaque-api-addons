const { EventEmitter } = require("node:events");
module.exports = class SpamChecker extends EventEmitter {
  constructor(option) {
    super()
    if (!client) throw Error("SpamCheckerConstructor.client is required.")
    const { client, maxCount, resetInterval } = option;
    if (!client.addons) client.addons = {};
    this.setting = {
      maxCount: maxCount || 10,
      resetInterval: resetInterval || 10000,
      checking: {
        AreaMessageCreate: false,
        GuildMessageCreate: false,
        DirectMessageCreate: false,
      },
    };
    this.checks = { Area: [], Guild: [], Direct: [] };
    client.addons.SpamChecker = this;
    this.client = client;
  }
  startCheck(type) {
    const SpamCheckType = require("./SpamCheckType");
    const t = SpamCheckType[type];
    if (!t) throw new Error(`${type} is invalid.`);
    if (this.setting.checking[t]) throw new Error("It is already be set.");
    this.setting.checking[t] = true;
    this.client.on(t, this.check);
  }
  endCheck(type) {
    const SpamCheckType = require("./SpamCheckType");
    const t = SpamCheckType[type];
    if (!t) throw new Error(`${type} is invalid.`);
    if (!this.setting.checking[t]) throw new Error("It is not be set.");
    this.setting.checking[t] = false;
    this.client.off(t, this.check);
  }
  check(message) {
    const type = message.shout ? "Area" : message.guild ? "Guild" : "Direct";
    if (type === "Direct" && !message.at)
      throw new Error("Unknown message type");
    const client = this
    client.addons.SpamChecker.checks[type].push(message.author.id);
    setTimeout(
      (() => client.addons.SpamChecker.checks[type].shift()),
      client.addons.SpamChecker.setting.resetInterval
    );
    if (
      this.addons.SpamChecker.checks[type].filter(
        (n) => n === message.author.id
      ).length >= this.addons.SpamChecker.setting.maxCount
    )
      this.addons.SpamChecker.emit(`${type}Spam`, message);
  }
}
