"use strict";

exports.buyItem = (pmcData, body, sessionID) => {
  if (!helper_f.payMoney(pmcData, body, sessionID)) {
    logger.logError("no money found");
    return "";
  }
  const newReq = {
    items: [
      {
        item_id: body.item_id,
        count: body.count,
      },
    ],
    tid: body.tid,
  };

  let tAssort = global._database.traders[body.tid].assort; //fileIO.readParsed(db.traders[body.tid].assort);
  if (typeof tAssort[body.item_id] != "undefined" && tAssort[body.item_id].currentStack) {
    tAssort[body.item_id].currentStack -= body.count;
    fileIO.write(db.traders[body.tid].assort, tAssort);
  }

  item_f.handler.setOutput(move_f.addItem(pmcData, newReq, sessionID));
  let output = item_f.handler.getOutput(sessionID);
  output.profileChanges[pmcData._id].traderRelations = { [body.tid]: pmcData.TradersInfo[body.tid] };
  logger.logSuccess(`Bought item: ${body.item_id}`);
};

// Selling item to trader
exports.sellItem = (pmcData, body, sessionID) => {
  let money = 0;
  let prices = trader_f.handler.getPurchasesData(body.tid, sessionID);
  let output = item_f.handler.getOutput(sessionID);

  for (let sellItem of body.items) {
    for (let item of pmcData.Inventory.items) {
      // profile inventory, look into it if item exist
      let isThereSpace = sellItem.id.search(" ");
      let checkID = sellItem.id;

      if (isThereSpace !== -1) {
        checkID = checkID.substr(0, isThereSpace);
      }

      // item found
      if (item._id === checkID) {
        logger.logInfo(`Selling: ${checkID}`);

        // remove item
        insurance_f.handler.remove(pmcData, checkID, sessionID);
        output = move_f.removeItem(pmcData, checkID, sessionID);

        // add money to return to the player
        if (output !== "") {
          money += parseInt(prices[item._id][0][0].count);
          break;
        }

        return "";
      }
    }
  }
  item_f.handler.setOutput(helper_f.getMoney(pmcData, money, body, output, sessionID));
  return;
};

// separate is that selling or buying
exports.confirmTrading = (pmcData, body, sessionID) => {
  // buying
  if (body.type === "buy_from_trader") {
    return this.buyItem(pmcData, body, sessionID);
  }

  // selling
  if (body.type === "sell_to_trader") {
    return this.sellItem(pmcData, body, sessionID);
  }

  return "";
};

// Ragfair trading
exports.confirmRagfairTrading = (pmcData, body, sessionID) => {
  let ragfair_offers_traders = fileIO.readParsed(db.user.cache.ragfair_offers);
  let offers = body.offers;
  //let output = item_f.handler.getOutput(sessionID);

  for (let offer of offers) {
    pmcData = profile_f.handler.getPmcProfile(sessionID);

    body = {
      Action: "TradingConfirm",
      type: "buy_from_trader",
      tid: "ragfair",
      item_id: offer.id,
      count: offer.count,
      scheme_id: 0,
      scheme_items: offer.items,
    };

    for (let offerFromTrader of ragfair_offers_traders.offers) {
      if (offerFromTrader._id == offer.id) {
        body.tid = offerFromTrader.user.id;
        break;
      }
    }

    //output =
    this.confirmTrading(pmcData, body, sessionID);
  }

  return; // output;
};
