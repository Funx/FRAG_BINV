//static class
var DB = {
	getJson: function(object) {
		return object.get()[0];
	}
	,
	getArray: function(object) {
		return object.get();
	}
	,
	getBirds: function(lieu,espece) {
		var taffyBirds = TAFFY(birds);
		if (!lieu) {
			return taffyBirds().get();
		} else {
			if (typeof lieu == "string") {
				lieu = DB.getAllAreas({id: lieu})[0];
			}
			var especes = TAFFY(lieu)().select("count");
			var myBirds = [];
			for (bird in especes[0]) {
				var theBird = taffyBirds({id: bird}).get()[0];
				theBird.population = lieu.count[theBird.id];
				theBird.lieu=lieu.id;
				myBirds.push(theBird);
			}
			;
			return myBirds;
		}
	}
	,
	getAreas: function(param) {
		var taffyAreas = TAFFY(sites);
		taffyAreas().each(function(site) {
			site.count = {};
			site.population = 0;
			site.species = {};
			TAFFY(DB.getBirds())().each(function(bird) {
				site.count[bird.id] = bird.count[site.id];
				site.population += bird.count[site.id];
				if (bird.count[site.id] > 0) {
					site.species[bird.id] = true;
				}
			});
			site.diversity = Object.keys(site.species).length;
			site.birdsPerHour = Math.round((site.population/site.h_filet)*10)/10;
		});
		if (param) {
			return taffyAreas(param).get();
		}
		return taffyAreas().get();
	}
	,
	getSectors: function(param) {
		var taffyAreas = TAFFY(DB.getAreas());

		var id_territoires = taffyAreas().distinct('territoire');
		var secteurs = [];

		var guadeloupe = {
			id: 'guadeloupe'
			, lieuDit: 'Guadeloupe'
			, h_filet: 0
			, population: 0
			, species: {}
			, count: {}
			, diversity: 0
		};

		for (id in id_territoires) {
			var secteur = {
				id: id_territoires[id]
				, lieuDit: id_territoires[id]
				, territoire: "Guadeloupe"
				, h_filet: 0
				, population: 0
				, species: {}
				, count: {}
				, diversity: 0
			};

			taffyAreas({territoire: secteur.id}).each(function(lieuDit) {
				secteur.h_filet += lieuDit.h_filet;
				guadeloupe.h_filet += lieuDit.h_filet;

				secteur.population += lieuDit.population;
				guadeloupe.population += lieuDit.population;
				for (espece in lieuDit.count) {
					if (!secteur.count[espece]) {
						secteur.count[espece] = 0;
					}
					if (!guadeloupe.count[espece]) {
						guadeloupe.count[espece] = 0;
					}
					secteur.count[espece] += lieuDit.count[espece];
					guadeloupe.count[espece] += lieuDit.count[espece];

					if (lieuDit.count[espece] > 0) {
						secteur.species[espece] = true;
						guadeloupe.species[espece] = true;
					}
					secteur.diversity = Object.keys(secteur.species).length;
					secteur.birdsPerHour = Math.round((secteur.population/secteur.h_filet)*100)/100;
				}
			});
			secteurs.push(secteur);
		}
		guadeloupe.diversity = Object.keys(guadeloupe.species).length;
		guadeloupe.birdsPerHour = Math.round((guadeloupe.population/guadeloupe.h_filet)*100)/100;
		secteurs.unshift(guadeloupe);
		
		if (param) {
			return TAFFY(secteurs)(param).get();
		}
		return secteurs;
	}
	,
	getAllAreas: function(param) {
		var all = DB.getAreas(param);
		var sectors = DB.getSectors(param);
		for (key in sectors) {
			all.push(sectors[key]);
		}
		return all;
	}
	,
	getbirdsPerHour: function(lieu, espece) {
		if (!lieu) {
			lieu = 'guadeloupe';
		}
		if (typeof lieu == "string") {
			lieu = TAFFY(DB.getAllAreas({id: lieu}))().get()[0];
		}
		if (!espece) {
			var nbCaptures = TAFFY(DB.getBirds(lieu))().sum("population");
		} else {
			var nbCaptures = TAFFY(DB.getBirds(lieu))({id: espece}).select("population");
		}

		var a = nbCaptures;
		var b = lieu.h_filet;
		if (!b || !a) {
			return 0;
		}
		return (a / b);
	}
	,
	getSumbirdsPerHour: function(lieu, espece) {
		var array = DB.getAreas({territoire: lieu}, {commune: lieu});

		var sum = 0;
		for (key in array) {
			var area = array[key];
			sum += DB.getbirdsPerHour(area, espece);
		}
		return sum;
	}
	,
	getCaptureRate: function(lieu, espece) {
	}
};