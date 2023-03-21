exports.mod = (mod_info) => {
  logger.logInfo("[MOD] NoBackpackRestriction");
	
  for(let id in global._database.items){
    let item = global._database.items[id];
    if(item._parent == "5448e53e4bdc2d60728b4567"){ // this is parent id of backpacks
      if(typeof item._props.Grids == "undefined") continue;
      for(let grid of item._props.Grids){
        if(typeof grid._props.filters == "undefined") continue;
        for(let filter of grid._props.filters){
          if(typeof filter.ExcludedFilter == "undefined") continue;
          filter.ExcludedFilter = [];
          logger.logDebug(`[MOD] removed restriction from ${id} now ExcludedFilter length is ${filter.ExcludedFilter.length}`);
        }
      }
    }
  }
	
	logger.logSuccess("[MOD] NoBackpackRestriction; Applied");
}