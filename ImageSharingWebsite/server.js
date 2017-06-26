'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});
server.connection({ port: 3000, host: "0.0.0.0" });

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true
        }
      }
    });
    var counter = 0;
    server.route({
      method: 'GET',
      path: '/api/increase',
      handler: function(request, reply) {
        counter++
        reply({ counter });
      }
    });

    server.route({
      method: 'GET',
      path: '/api/decrease',
      handler: function(request, reply) {
        counter--
        reply({ counter });      
      }
    });
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
