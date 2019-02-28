var config = require('./config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.address,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    // storage: 'path/to/database.sqlite',

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    // operatorsAliases: false
});

const PortalJobMeta = sequelize.define('portal_job_meta', {
    id: {type:Sequelize.INTEGER, primaryKey:true, autoIncrement: true},
    uid: Sequelize.INTEGER,
    username: Sequelize.STRING,
    tables: Sequelize.TEXT,
    master: Sequelize.TEXT,
    portal_jid: Sequelize.STRING,
    jid: Sequelize.STRING,
    port: Sequelize.STRING
});

const User = sequelize.define('user', {
    uid: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    username: Sequelize.STRING,
    password: {type:Sequelize.STRING, defaultValue: ''}
});


module.exports = {
    sequelize: sequelize,
    PortalJobMeta: PortalJobMeta,
    User: User
};

