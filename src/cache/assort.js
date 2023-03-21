exports.cache = () => {
  if (!serverConfig.rebuildCache) {
    return;
  }
  /* assort */
  for (let trader in db.traders) {
    logger.logInfo(`Caching: assort_${trader}.json`);
    let base = {
      err: 0,
      errmsg: null,
      data: { items: [], barter_scheme: {}, loyal_level_items: {} },
    };
    let inputNodes = fileIO.readParsed(db.traders[trader].assort);
    for (let item in inputNodes) {
      if (trader != "ragfair") {
        if (typeof inputNodes[item].items[0] != "undefined") {
          let ItemsList = inputNodes[item].items;
          ItemsList[0]["upd"] = {};
          if (inputNodes[item].default.unlimited) ItemsList[0].upd["UnlimitedCount"] = true;
          ItemsList[0].upd["StackObjectsCount"] = inputNodes[item].currentStack;
        }
      } else {
        if (typeof inputNodes[item].items[0] != "undefined") {
          inputNodes[item].items[0]["upd"] = {};
          inputNodes[item].items[0].upd["StackObjectsCount"] = 99;
        }
      }
      for (let assort_item in inputNodes[item].items) {
        base.data.items.push(inputNodes[item].items[assort_item]);
      }
      base.data.barter_scheme[item] = inputNodes[item].barter_scheme;
      base.data.loyal_level_items[item] = inputNodes[item].loyalty;
    }

    fileIO.write(`./user/cache/assort_${trader}.json`, base, true, false);

    if ("suits" in db.traders[trader]) {
      logger.logInfo(`Caching: customization_${trader}.json`);

      if (typeof db.traders[trader].suits == "string") {
        fileIO.write(`./user/cache/customization_${trader}.json`, fileIO.readParsed(db.traders[trader].suits), true, false);
      } else {
        let base = [];
        for (let file in db.traders[trader].suits) {
          base.push(fileIO.readParsed(db.traders[trader].suits[file]));
        }
        fileIO.write(`./user/cache/customization_${trader}.json`, base, true, false);
      }
    }
  }
};
