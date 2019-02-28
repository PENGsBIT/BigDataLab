module.exports = {
    serverResult: {
        module: './server-result',
        routes: [{
            method: 'post',
            regex: '/result',
            permission: '',
            entrance: 'receiveResult'
        }]
    },
    serverLog: {
        module: './server-log',
        routes: [{
            method: 'post',
            regex: '/log',
            permission: '',
            entrance: 'receiveLog'
        }]
    },
    // getIDTable: {
    //     module: './get-ID-Table',
    //     routes: [{
    //         method: 'post',
    //         regex: '/jid',
    //         permission: '',
    //         entrance: 'getId'
    //     }]
    // },
    taqlTable: {
        module: './taql-tables',
        routes: [{
            method: 'post',
            regex: '/tables',
            permission: '',
            entrance: 'setTable'
        }, {
            method: 'get',
            regex: '/jid/:jid/tables',
            permission: '',
            entrance: 'getTable'
        }, {
            method: 'delete',
            regex: '/jid/:jid/',
            permission: '',
            entrance: 'deleteId',
        }, {
            method: 'get',
            regex: '/jid/:jid/status/:status',
            permission: '',
            entrance: 'sendStatus'
        }]
    },
    userCreation: {
        module: './user-management',
        routes: [{
            method: 'post',
            regex: '/user',
            permission: '',
            entrance: 'createUser'
        }]
    },
    userVerification: {
        module: './user-management',
        routes: [{
            method: 'post',
            regex: '/verify',
            permission: '',
            entrance: 'userVerify'
        }]
    },
    jobList: {
        module: './user-management',
        routes: [{
            method: 'post',
            regex: '/joblist',
            permission: '',
            entrance: 'getJobList'
        }]
    },
    startJob: {
        module: './start-job',
        routes: [{
            method: 'get',
            regex: '/start_job/jid/:jid/masterip/:masterip/port/:port',
            permission: '',
            entrance: 'get'
        }]
    },
    flows: {
        module: './flows',
        routes: [{
            method: 'get',
            regex: '/flows',
            permission: 'flows.read',
            entrance: 'get'
        }, {
            method: 'post',
            regex: '/flows',
            permission: 'flows.write',
            entrance: 'post'
        }, {
            method: 'post',
            regex: '/startup',
            permission: 'flows.write',
            entrance: 'load'
        }]
    },
    flow: {
        module: './flow',
        routes: [{
            method: 'get',
            regex: '/flow/:id',
            permission: 'flows.read',
            entrance: 'get'
        }, {
            method: 'post',
            regex: '/flow',
            permission: 'flows.write',
            entrance: 'post'
        }, {
            method: 'delete',
            regex: '/flow/:id',
            permission: 'flows.write',
            entrance: 'delete'
        }, {
            method: 'put',
            regex: '/flow/:id',
            permission: 'flows.write',
            entrance: 'put'
        }]
    },
    nodes: {
        module: './nodes',
        routes: [{
            method: 'get',
            regex: '/nodes',
            permission: 'nodes.read',
            entrance: 'getAll'
        }, {
            method: 'post',
            regex: '/nodes',
            permission: 'nodes.write',
            entrance: 'post'
        }, {
            method: 'get',
            regex: /\/nodes\/((@[^\/]+\/)?[^\/]+)$/,
            permission: 'nodes.read',
            entrance: 'getModule'
        }, {
            method: 'put',
            regex: /\/nodes\/((@[^\/]+\/)?[^\/]+)$/,
            permission: 'nodes.write',
            entrance: 'putModule'
        }, {
            method: 'delete',
            regex: /\/nodes\/((@[^\/]+\/)?[^\/]+)$/,
            permission: 'nodes.write',
            entrance: 'delete'
        }, {
            method: 'get',
            regex: /\/nodes\/((@[^\/]+\/)?[^\/]+)\/([^\/]+)$/,
            permission: 'nodes.read',
            entrance: 'getSet'
        }, {
            method: 'put',
            regex: /\/nodes\/((@[^\/]+\/)?[^\/]+)\/([^\/]+)$/,
            permission: 'nodes.write',
            entrance: 'putSet'
        }]
    },
    credentials: {
        module: './credentials',
        routes: [{
            method: 'get',
            regex: '/credentials/:type/:id',
            permission: 'credentials.read',
            entrance: 'get'
        }]
    },
    locales: {
        module: './locales',
        routes: [{
            method: 'get',
            regex: /locales\/(.+)\/?$/,
            permission: '',
            entrance: 'get'
        }]
    },
    library: {
        module: './library',
        routes: [{
            method: 'get',
            regex: '/library/flows',
            permission: 'library.read',
            entrance: 'getAll'
        }, {
            method: 'post',
            regex: new RegExp('/library/flows\/(.*)'),
            permission: 'library.write',
            entrance: 'post'
        }, {
            method: 'get',
            regex: new RegExp('/library/flows\/(.*)'),
            permission: 'library.read',
            entrance: 'get'
        }]
    },
    info: {
        module: './info',
        routes: [{
            method: 'get',
            regex: '/settings',
            permission: 'settings.read',
            entrance: 'settings'
        }]
    },
    wanda: {
        module: './wanda',
        routes: [{
            method: 'post',
            regex: '/url/generate',
            permission: '',
            entrance: 'generateUrl'
        },{
            method: 'get',
            regex: '/jid/:jid',
            permission: '',
            entrance: 'renderHtml'
        },{
            method: 'get',
            regex: '/run/:jid',
            permission: '',
            entrance: 'runJob'
        },{
            method: 'get',
            regex: '/taskinfo/:jid',
            permission: '',
            entrance: 'statusQuery'
        },{
            method:'get',
            regex: '/table_columns/:jid/:table',
            permission: '',
            entrance: 'getColumns'
        },{
            method:'get',
            regex: '/result/:jid',
            permission: '',
            entrance: 'parseResult'
        }]
    },
    driver: {
        module: './driver',
        routes: [{
            method:'post',
            regex: '/dmp-api/external/dataUseJobResult',
            permission: '',
            entrance: 'jobResult'
        }]
    }

};