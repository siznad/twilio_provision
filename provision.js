//John McGaughey 8/6/2020

exports.handler = function(context, event, callback) {
    const client = context.getTwilioClient();

    switch (event.action) {
        case 'add': 
            client.taskrouter.workspaces
            .list({friendlyName: event.workspace, limit: 1})
            .then(workspace => {
                if (workspace.length === 0) {
                    let response = {'status':400, 'Content-Type':'application/json',};
                    return callback('Worspace ' + event.workspace + ' does not exist.', response);
                    } else {
                        return workspace[0].sid;
                    }
                })
                .then((wsSID) => {
                    return client.taskrouter.workspaces(wsSID)
                    .workers
                    .create({
                        friendlyName: event.friendlyName,
                        attributes: JSON.stringify(event.attributes)
                    });
                })
                .then(worker => {
                    return client.taskrouter.workspaces(worker.workspaceSid)
                    .workers(worker.sid)
                    .workerChannels
                    .list({limit: 20});
                })
                .then(workerChannels => {
                    var promises = [];
                    workerChannels.forEach(w => {
                        try {
                            promises.push(      
                                client.taskrouter.workspaces(w.workspaceSid)
                                .workers(w.workerSid)
                                .workerChannels(w.sid)
                                .update({capacity: parseInt(event.taskchannels[w.taskChannelUniqueName][0]), available: JSON.parse(event.taskchannels[w.taskChannelUniqueName][1])})
                                .then(worker_channel => console.log('Successfully updated channel ' + worker_channel.taskChannelUniqueName))
                                .catch(err => console.log(err))
                            );
                        } catch (err) {
                            console.log(w.taskChannelUniqueName + ' not found in request.  Leaving at the default value.');
                        }
                    });
                    Promise.all(promises).then(() => {
                        let response = {'status':200, 'Content-Type':'application/json',};
                        callback(null, response);    
                    })
                    .catch((err) => {
                        let response = {'status':500, 'Content-Type':'application/json',};
                        callback(err, response);
                    });
                })
                .catch(err => {
                    console.log(err);
                    let response = {'status':500, 'Content-Type':'application/json',};
                    callback(err, response);
                });
            break;

        case 'delete':
            client.taskrouter.workspaces
            .list({friendlyName: event.workspace, limit: 1})
            .then(workspace => {
                if (workspace.length === 0) {
                    let response = {'status':400, 'Content-Type':'application/json',};
                    return callback('Worspace ' + event.workspace + ' does not exist.', response);
                    } else {
                        return workspace[0].sid;
                    }
            })
            .then((wsSID) => {
                return client.taskrouter.workspaces(wsSID)
                .workers
                .list({friendlyName: event.friendlyName, limit: 1});
            })
            .then(worker => {
                var promises = [];
                promises.push(
                    client.taskrouter.workspaces(worker[0].workspaceSid)
                    .workers(worker[0].sid)
                    .remove()
                );
                Promise.all(promises).then(() => {
                    let response = {'status':200, 'Content-Type':'application/json',};
                    callback(null, response);
                })
                .catch((err) => {
                    let response = {'status':500, 'Content-Type':'application/json',};
                    callback(err, response);
                });
            })
            .catch(err => {
                console.log(err);
                let response = {'status':500, 'Content-Type':'application/json',};
                callback(err, response);
            });
        break;
        
        case 'update':
            client.taskrouter.workspaces
            .list({friendlyName: event.workspace, limit: 1})
            .then(workspace => {
                if (workspace.length === 0) {
                    let response = {'status':400, 'Content-Type':'application/json',};
                    return callback('Worspace ' + event.workspace + ' does not exist.', response);
                    } else {
                        return workspace[0].sid;
                    }
            })
            .then((wsSID) => {
                return client.taskrouter.workspaces(wsSID)
                .workers
                .list({friendlyName: event.friendlyName, limit: 1});
            })
            .then(worker => {
                return client.taskrouter.workspaces(worker[0].workspaceSid)
                .workers(worker[0].sid)
                .workerChannels
                .list({limit: 20});
            })
            .then(workerChannels => {
                var promises = [];
                workerChannels.forEach(w => {
                    try {
                        promises.push(      
                            client.taskrouter.workspaces(w.workspaceSid)
                            .workers(w.workerSid)
                            .workerChannels(w.sid)
                            .update({capacity: parseInt(event.taskchannels[w.taskChannelUniqueName][0]), available: JSON.parse(event.taskchannels[w.taskChannelUniqueName][1])})
                            .then(worker_channel => console.log('Successfully updated channel ' + worker_channel.taskChannelUniqueName))
                            .catch(err => console.log(err))
                        );
                    } catch (err) {
                        console.log(w.taskChannelUniqueName + ' not found in request.  Leaving at the current value.');
                    }
                });
                Promise.all(promises).then(() => {
                    let response = {'status':200, 'Content-Type':'application/json',};
                    callback(null, response);    
                })
                .catch((err) => {
                    let response = {'status':500, 'Content-Type':'application/json',};
                    callback(err, response);
                });
            })
            .catch(err => {
                console.log(err);
                let response = {'status':500, 'Content-Type':'application/json',};
                callback(err, response);
            });
            break;
    }
};