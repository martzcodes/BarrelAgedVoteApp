module.exports = {
	port: process.env.PORT || 3001,
    db: process.env.MONGO_HOST ||
    'localhost',
    dbname: process.env.DB_NAME || '/boundarystone'
}