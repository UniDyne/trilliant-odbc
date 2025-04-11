const fs = require('fs'),
    path = require('path'),
    odbc = require('odbc');

const {DEFAULT_CONFIG} = require('./constants');
const {loadQueries, createCallbackQuery} = require('./QueryJobs');

// Rather than implement pooling as done with trilliant-tedious,
// this will simply provide a wrapper on odbc's Pool.
// We will attempt to implement named parameters and provide
// translation for positional parameters since odbc doesn't support.

module.exports = class ConnectionPool {
        #config;
        #pool;
        #running = false;

        constructor(config) {
            const sqlcfg = Object.assign({}, DEFAULT_CONFIG, config);

            this.#config = sqlcfg;

            odbc.pool(this.#config).then(p => {
                this.#pool = p;
            });
        }

        start() { this.#running = true; }
        stop() { this.#running = false; }
        exit() {
            this.stop();
            this.#pool.close();
        }

        getConnection() {
            return this.#pool;
        }

        exec(sql, callback) {
            createCallbackQuery({sql:sql, params:[]}, this)(null, callback);
        }

        loadQueries(queryList, baseDir) {
            return loadQueries(queryList, baseDir, this);
        }
};

