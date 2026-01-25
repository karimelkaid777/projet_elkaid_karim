
exports.get = (req, res) => {
        const catalogue = [
		{ref:"X001", titre : "Linux", prix : 10},
		{ref:"X002", titre : "Angular", prix : 20}
		];
		
	
	res.setHeader('Content-Type', 'application/json');
      
    res.send(catalogue);
   };    

