# Spark2

Spark2 is a fork of the Spark command-line tool used to start up node server instances written by [Tj Holowaychuk](http://github.com/visionmedia) and [Tim Caswell](http://github.com/creationix).  It's part of the [Connect](http://github.com/senchalabs/connect) framework, however can be used standalone with _any_ node server.

## Why the fork?

Due to the nature of the CLA required to submit my changes back to Sencha, I have chosen to fork Spark myself and add the features I needed.

## What is different?

For the most part, they are identical. Spark2 contains some helpful management tools missing from the original.

The most useful is the "auto re-spawn children" feature. If a worker dies, spark2 will respawn a replacement child.

You can also manage the server for hot code deployment. The original Spark had the main process listen on the app as well as the workers. Spark2's main process doesn't listen on the app, only the workers do.
That allows you to do things like this:

    spark2 -n 10 &
    --exit the terminal and log back in..
    --Now update your source, then
    spark2 --respawn (This will respawn all the worker processes to reload the code.

You can also call:
    spark2 --kill to kill the main process and it's workers.

This can also be done from the shell by sending the right signals:

    kill -s SIGCONT PID (respawn all children)
    kill PID (kill)

I also fixed an issue where command line arguments are overwritten if there is a config. Now commandline arguments override the config so you can test locally with a production config.

stdout/stderror of the worker is forwarded to the master pid.

Simple support for access.log, just add an accesslog file pointer to the config, then apply

    app.use(express.logger());

stdout will autoforward from the worker to the master process and write the result to the provided file.

## Features

Spark2 provides the following options when starting a server.

 - Port/Host to listen on
 - SSL hosting with specified key/certificate
 - Automatic child process spawning for multi-process node servers that share a common port.
 - User/Group to drop to after binding (if run as root)
 - Environment modes (development/testing/production)
 - Modify the node require paths
 - Can load any of these configs from from a file (optionally grouped by env)
 - Can change the working directory before running the app
 - `--comment` option to label processes in system tools like `ps` or `htop`
 - Pass arbitrary code or environment variables to the app

## Making an app spark compatible

Any node server can be used with spark2.  All you need to do it create a file called `app.js` or `server.js` that exports the instance of `http.Server` or `net.Server`.

A hello-world example would look like this:

    module.exports = require('http').createServer(function (req, res) {
        res.writeHead(200, {"Content-Type":"text-plain"});
        res.end("Hello World");
    });

And then to run it you simply go to the folder containing the `app.js` or `server.js` and type:

    $ spark2

The output you'll see will be:

    Spark2 server(34037) listening on http://*:3000 in development mode

Where `34037` is the process id. If you want 4 processes to balance the requests across, no problem.

    $ spark2 -n 4

And you'll see:

    Spark2 server(34049) listening on http://*:3000 in development mode
    Spark2 server(34050) listening on http://*:3000 in development mode
    Spark2 server(34052) listening on http://*:3000 in development mode
    Spark2 server(34051) listening on http://*:3000 in development mode

