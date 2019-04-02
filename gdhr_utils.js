var gdhr_Utils = Class.create();
gdhr_Utils.prototype = Object.extendsObject(hr_Utils, {
	getOpenedForUsers: function() {
		var roles = gs.getUser().getRoles();
		if (roles.indexOf(hr.ROLE_HR_CASE_WRITER) > -1) {
			//return all client users if case_writer
			return this.getHRClientUsers();
		} else {
			var users = [gs.getUserID()];
			return 'sys_idIN' + users.join(',');
		}
	},
	getSubjectPersonUsers: function() {
		var roles = gs.getUser().getRoles();
		if (roles.indexOf(hr.ROLE_HR_CASE_WRITER) > -1)
		//return all client users if case_writer
		{
			return this.getHRClientUsers();
		} else {
			//return only the subordinates and himself for current user
			var users = this.getHRClientSubordinateUsers(gs.getUserID());
			return 'sys_idIN' + users.join(',');
		}
	},
	getHRClientUsers: function() {
		//modified hr_Utils getHRClientUsers() function to return empty string instead of "active=true"
		return "";
	},
	/**
	 * @param {string} recipients - The value of "email.recipients" from the email condition script
	 * @param {Array|string} prodAddresses - An array (or semicolon-delimited, or comma-delimited string) consisting of the addresses to check for if we're in prod. If one of these addresses is found in the recipients list (and we're in prod) then the function will return true.
	 * @param {Array|string} subProdAddress - Same as the "prodAddresses" param, except this only returns true if the address is found, and we're NOT in prod.
	 * @returns {boolean} - Whether one or more address in the prodAddresses (if prod) or subProdAddresses (if not in prod) arguments are found in the recipients argument.
	 * @example - new gdhr_Utils().checkProdVsTestEmails(email.recipients, ['PROD_EMAIL@godaddy.com'], ['TEST_EMAIL@godaddy.com'])
	 */
	checkProdVsTestEmails: function(recipients, prodAddresses, subProdAddress) {
		var i,
			address,
			delimiter,
			addressesToCheck,
			isProd = (gs.getProperty('glide.installation.production', 'false') == 'true');

		recipients = recipients.toLowerCase();
		//Determine which address(es) we're going to check for, based on whether we're in prod.
		addressesToCheck = isProd ? prodAddresses : subProdAddress;

		//Make sure that addressesToCheck is an array, even if it contains only one element.
		if (typeof addressesToCheck == 'string') {
			//If addressesToCheck contains a semicolon, split on that.
			//Otherwise, assume the delimiter is a comma and split on that.
			delimiter = addressesToCheck.indexOf(';') >= 0 ? ';' : ',';
			//Split the string into an array based on the delimiter discovered above.
			addressesToCheck = addressesToCheck.split(delimiter);
		}

		//Loop over each address we want to check for,
		// and check if that address is in the recipients list.
		//If so, return true. Otherwise, loop again until the end of the list.
		for (i = 0; i < addressesToCheck.length; i++) {
			address = addressesToCheck[i].toLowerCase();
			if (recipients.indexOf(address) >= 0) {
				return true;
			}
		}

		//If the loop never returns true, then none of the addresses we're checking for
		// were in the recipients list, so return false.
		return false;
	},

	type: 'gdhr_Utils'
});
