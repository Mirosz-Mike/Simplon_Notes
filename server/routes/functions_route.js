const connection = require("../config");

const __query = (queryName, escapeInjection) => {
	return new Promise((resolve, reject) => {
		connection.query(queryName, escapeInjection, function(err, result) {
			if (err) {
				console.log("erreur query: ", err);
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

const checkGoodFormatImages = (request) => {
	const extensionBadFormat = /.js|.php|.rb|.sql|.jsx|.odt|.ts/;
  const nameImage = request.files

	return nameImage.some(fileExtension => extensionBadFormat.test(fileExtension.originalname))
}

module.exports = {
	__query: __query,
	checkGoodFormatImages: checkGoodFormatImages
}