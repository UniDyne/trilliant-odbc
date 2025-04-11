const
    fs = require("fs"),
    path = require("path");

const {ServiceWrapper} = require('trilliant');
const ConnectionPool = require('./ConnectionPool');

module.exports = class ODBCService extends ServiceWrapper {
    constructor(app, config) {
        super(app, config);

        if(typeof config === "string")
            config = JSON.parse(fs.readFileSync(path.join(app.Env.appPath, config), "utf8"));

        this.Pool = new ConnectionPool(config);
    }

    start() { this.Pool.start(); }
    stop() { this.Pool.stop(); }

    register(plug, data) {
        let q;
        
        if(typeof data === "string")
            q = JSON.parse( fs.readFileSync(path.join(plug.homeDir, data)) );
        else q = data;
        
        plug.Queries = this.Pool.loadQueries(q, plug.homeDir);
    }

    loadQueries(q, homeDir) {
        return this.Pool.loadQueries(q, homeDir);
    }
};