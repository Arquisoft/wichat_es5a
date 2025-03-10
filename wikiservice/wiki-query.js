class WikiQuery {
	async SPARSQLQuery(query) {
		try {
		  const axios = require('axios');
		  const endpointUrl = 'https://query.wikidata.org/sparql'; // Access point URL SPARQL of Wikidata
	  
		  const headers = {
			'User-Agent': 'TuUsuario/1.0 (correo@example.com)',
			'Accept': 'application/json',
		  };

		  const params = {
			format: 'json',
			query: query,
		  };
	  
		  const response = await axios.get(endpointUrl, { params, headers });
	  
		  return response.data;
		} catch (error) {
		  console.error('Error al realizar la consulta SPARQL:', error);
		  throw error;
		}
	  }
}

module.exports = WikiQuery;