module.exports = {
	port: process.env.PORT || 3001,
    db: process.env.MONGO_HOST ||
    'localhost',
    dbport: process.env.MONGO_PORT || '27017',
    dbname: process.env.DB_NAME || '/boundarystone',
    dbuser: process.env.MONGO_USER || '',
    dbpass: process.env.MONGO_PASS || ''
};