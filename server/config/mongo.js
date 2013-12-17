'use strict';
module.exports = {
        'server': {
                'port': 9000
        },
        'store': generate_mongo_url
};

// Helper function for generating mongodb configs
function generate_mongo_url( obj ) {
        obj.hostname = ( obj.hostname || 'localhost' );
        obj.port = ( obj.port || 'port' );
        obj.db = ( obj.db || 'sample_development' );
        if ( obj.username && obj.password ) {
                return 'mongodb://' + obj.username + ':' + obj.password + '@' + obj.hostname + ':' + obj.port + '/' + obj.db;
        } else {
                return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
        }
}