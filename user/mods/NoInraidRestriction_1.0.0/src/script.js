exports.mod = (mod_info) => {
  logger.logInfo("[MOD] NoInraidRestriction");
	
  global._database.globals.config.RestrictionsInRaid = [];
	
	logger.logSuccess("[MOD] NoInraidRestriction; Applied");
}