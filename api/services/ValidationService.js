
module.exports = {

	// ENUM used in medication model. Specifies allowed values for 'unit' attribute
	// This enum is also in the client, and problems arise if client tries to create
	// a medication where unit-value is not in list. Any changes to this list has to
	// be reflected in back-end and front-end

	validUnits: ['ml', 'pill', 'inhalation', 'mg', 'mcg', 'g', 'unit']
}