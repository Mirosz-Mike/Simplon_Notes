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
  const extensionBadFormat = [".js", ".php", ".rb", ".sql", ".odt"];
  const nameImage = request.files.map(image => image.originalname);

  // les resultats de checkBadformat true = image non valide sinon false une image valide
  const resultBadFormat = [];

  const checkBadFormat = extensionBadFormat.map(extension => {
    for (let i = 0; i < nameImage.length; i++) {
      resultBadFormat.push(nameImage[i].includes(extension));
    }
  });

  return resultBadFormat
}

module.exports = {
	__query: __query,
	checkGoodFormatImages: checkGoodFormatImages
}