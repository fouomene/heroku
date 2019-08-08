
const path = require('path')
const PORT = process.env.PORT || 5000

/*express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/
  


const conseiljs = require('conseiljs');
let alphanetFaucetAccount = {
    "mnemonic": [
      "noise",
      "orient",
      "provide",
      "animal",
      "squirrel",
      "awkward",
      "physical",
      "science",
      "nature",
      "woman",
      "orient",
      "raise",
      "main",
      "input",
      "bachelor"
    ],
    "secret": "68a66fc1367228f5e283be3a86302f6e92280ab2",
    "amount": "58219428237",
    "pkh": "tz1byEzc7Yx5fycvVM79WRR5gtjJBQpFJaD6",
    "password": "0A3bpTYap0",
    "email": "xchznuab.mvqizwbg@tezos.example.org"
  }

let keystore = {};
const tezosNode = 'https://tezos-dev.cryptonomic-infra.tech:443';
const conseilNode = {
    url: 'https://conseil-dev.cryptonomic-infra.tech:443',
    apiKey: 'BUIDLonTezos-025'
}
 
let pkhDestination = " ";
let amountTransfere = 0;
let feeTransfere = 0;
let secret= " ";

const platform = 'tezos';
const network = 'alphanet';
const entity = 'accounts';

const conseilServer = { url: 'https://conseil-dev.cryptonomic-infra.tech:443', apiKey: 'BUIDLonTezos-025' };

async function accountInfo(address) {
    // Return new promise 
    return new Promise(function(resolve, reject) {

        let transactionQuery = conseiljs.ConseilQueryBuilder.blankQuery();
        transactionQuery = conseiljs.ConseilQueryBuilder.addFields(transactionQuery, 'account_id', 'manager', 'delegate_value', 'balance', 'block_level');
        transactionQuery = conseiljs.ConseilQueryBuilder.addPredicate(transactionQuery, 'account_id', conseiljs.ConseilOperator.EQ, [address], false);
        transactionQuery = conseiljs.ConseilQueryBuilder.setLimit(transactionQuery, 1);
    
        const resultReponse = conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, platform, network, entity, transactionQuery);
     // Do async job
    // const platforms = conseiljs.TezosConseilClient.getAccount(serverInfo, network, accountID);
     resolve(resultReponse);
   })

} 

async function getPublicPrivateKey() {
           // Return new promise 
           return new Promise(function(resolve, reject) {
            // Do async job
            const keystoreReponse = conseiljs.TezosWalletUtil.unlockFundraiserIdentity(alphanetFaucetAccount.mnemonic.join(' '), alphanetFaucetAccount.email, alphanetFaucetAccount.password, alphanetFaucetAccount.pkh);
            resolve(keystoreReponse);
          })

} 

async function initializeAccountTest() {
      // Return new promise 
      return new Promise(function(resolve, reject) {
        console.log(keystore);
        // Do async job
        const resultReponse = conseiljs.TezosNodeWriter.sendIdentityActivationOperation(tezosNode, keystore, '68a66fc1367228f5e283be3a86302f6e92280ab2', '');
        resolve(resultReponse);
      }) 
}

async function initializeAccount() {
    // Return new promise 
    return new Promise(function(resolve, reject) {
      console.log(keystore);
      // Do async job
      const resultReponse = conseiljs.TezosNodeWriter.sendIdentityActivationOperation(tezosNode, keystore, secret, '');
      resolve(resultReponse);
    }) 
}

async function revealAccount() {
    return new Promise(function(resolve, reject) {
        console.log(keystore);
        // Do async job
        const resultReponse = conseiljs.TezosNodeWriter.sendKeyRevealOperation(tezosNode, keystore);
        resolve(resultReponse);
      })
}

//sendTransaction Test
async function sendTransactionTest() {
    return new Promise(function(resolve, reject) {    
        console.log(keystore);
        // Do async job
        const resultReponse = conseiljs.TezosNodeWriter.sendTransactionOperation(tezosNode, keystore, 'tz1TANP8y62Gbb5d2CwC8PJAPNQJrSBcGLWh', 500000, 1500, '');
        resolve(resultReponse);
      })
}

//sendTransaction
async function sendTransaction() {
    return new Promise(function(resolve, reject) {    
        console.log(keystore);
        // Do async job
        const resultReponse = conseiljs.TezosNodeWriter.sendTransactionOperation(tezosNode, keystore, pkhDestination, amountTransfere, feeTransfere, '');
        resolve(resultReponse);
      })
}

//const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express'); // objet Express
let mysql = require('mysql');
let session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'freelancertech',
    password : 'freelancertech',
    database : 'weather_app_bd'
});  //initialisation et connection retour objet connexion
const apiKey ="199474e86b5183778fb2bbfed2d8224d";
var cors = require('cors');
app.use(cors());
app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    strict: false,
  })); // permettre de recevoir les objets JSOn via le post

  //creation d'un objet session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

let reponse = {
    status:0,
    message:'',
    pkh:'',
    balance:0
}


app.set('view engine', 'ejs')






///Create a Tezos alphanet account
app.get('/wallet/api/createtezosaccounttest', function (req, res) {
    
    var getPublicPrivateKeyPromise = getPublicPrivateKey();
    getPublicPrivateKeyPromise.then(function(result) {
        keystore = result;
        console.log(`public key: ${keystore.publicKey}`);
        console.log(`secret key: ${keystore.privateKey}`);
        res.send(result);
    }, function(err) {
        console.log(err);
    })

})

//Initialize the account
app.get('/wallet/api/initializetest', function (req, res) {
    
    var initializePromise = initializeAccountTest();
    initializePromise.then(function(result) {
        console.log(`Injected operation group id ${result.operationGroupID}`)
        res.send(result);
    }, function(err) {
        console.log(err);
    })
 
})

// revealAccount
app.get('/wallet/api/revealtest', function (req, res) {
    
    var revealAccountPromise = revealAccount();
    revealAccountPromise.then(function(result) {
        console.log(`Injected operation group id ${result.operationGroupID}`);
        res.send(result);
    }, function(err) {
        console.log(err);
    })
    
})

// Transfer value
app.get('/wallet/api/transfertest', function (req, res) {
    
    var transferValuePromise = sendTransactionTest();
    transferValuePromise.then(function(result) {
        console.log(`Injected operation group id ${result.operationGroupID}`);
        res.send(result);
    }, function(err) {
        console.log(err);
    }) 
})



// Save alphanetFaucetAccount
app.post('/wallet/api/savealphanetaccount',function (req,res) {
    let emailusers = req.body.emailusers;
    alphanetFaucetAccount = req.body.alphfaucetaccount;
    console.log(req.body);

    if(alphanetFaucetAccount && emailusers)
    {    
        // stringify JSON Object
       // var alphanetFaucetAccountString = JSON.stringify(alphanetFaucetAccount);
        //console.log(alphanetFaucetAccountString); 
        console.log("Connected!");
        var sql = `UPDATE users SET alphFaucetAccount ='${alphanetFaucetAccount}', active=1 WHERE (email_users = '${emailusers}')`;
        connection.query(sql, function (err, result) {
            if (err) {
                reponse.status=404;
                reponse.message = err;
                res.send(reponse);
            }

            var alphanetFaucetAccountJson = JSON.parse(alphFaucetAccount);
            console.log(alphanetFaucetAccountJson);

            reponse.status=200;
            reponse.message = 'Succes save!!';
            reponse.pkh = alphanetFaucetAccountJson.pkh; 
            console.log("Succes save!!");
            res.send(reponse);
        });


    }else {

        reponse.status=201;
        reponse.message = 'all fields must be filled';
        res.send(reponse);
    }
})


//get all transactions of user
app.get('/wallet/api/transactions/:email', function (req, res) {
    
    let emailusers = req.params.email;
    console.log(emailusers);
    console.log("Connected!");
    var sql = `SELECT * FROM users  WHERE (email_users = '${emailusers}')`;
    connection.query(sql, function (err, result) {
        if (err) {
            reponse.status=404;
            reponse.message = err;
            res.send(reponse);
        }
        if (result) {

                alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
                console.log(alphanetFaucetAccount);
                var sql = `SELECT * FROM transactiontezos  WHERE (pkhsource = '${alphanetFaucetAccount.pkh}')`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        reponse.status=404;
                        reponse.message = err;
                        res.send(reponse);
                    }
                    if (result) {

                        res.send(result);   

                    }
                });     

        }
    });
    


})

/////api get Balance of User
app.get('/wallet/api/balanceaccount/:email', function (req, res) {
    
    let emailusers = req.params.email;
    console.log(emailusers);
    console.log("Connected!");
    var sql = `SELECT * FROM users  WHERE (email_users = '${emailusers}')`;
    connection.query(sql, function (err, result) {
        if (err) {
            reponse.status=404;
            reponse.message = err;
            res.send(reponse);
        }
        if (result) {

            if ( result[0].alphFaucetAccount != null) {  
            
                alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
                console.log(alphanetFaucetAccount);
                var accountInfoPromise = accountInfo(alphanetFaucetAccount.pkh);
                accountInfoPromise.then(function(result) {
                    console.log(result);
                    res.send(result);
                }, function(err) {
                    console.log(err);
                })     
            }else{

                reponse.pkh = 'vide';
                reponse.balance = 0;
                res.send(JSON.stringify([{"block_level":558075,"balance":0,"delegate_value":null,"account_id":"vide","manager":"tz1dg4qeBETdNzShsMUkJUEjk6pfuGL2jX5o"}]));

           

            }
        }
    });
    

})

//api get my keys (public/private) keystone
app.get('/wallet/api/getmykeystone/:email', function (req, res) {
    
    let emailusers = req.params.email;
    console.log(emailusers);
    console.log("Connected!");
    var sql = `SELECT * FROM users  WHERE (email_users = '${emailusers}')`;
    connection.query(sql, function (err, result) {
        if (err) {
            reponse.status=404;
            reponse.message = err;
            res.send(reponse);
        }
        if (result) {

            if(result[0].active === 1)
            {
                alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
                console.log(alphanetFaucetAccount);
                
                
                //request to Tezos
                var getPublicPrivateKeyPromise = getPublicPrivateKey();
                getPublicPrivateKeyPromise.then(function(result) {
                    keystore = result; 
                    console.log(`public key: ${keystore.publicKey}`);
                    console.log(`secret key: ${keystore.privateKey}`);

                    // stringify JSON Object
                    var keystoreString = JSON.stringify(keystore);
                    console.log(keystoreString);
                    console.log("Connected!");
                    var sql = `UPDATE users SET keystore='${keystoreString}', active=2 WHERE (email_users = '${emailusers}')`;
                    connection.query(sql, function (err, result) {
                        if (err) {
                            reponse.status=404;
                            reponse.message = err;
                            res.send(reponse);
                        }
            
                        res.send(keystore);
                    });

                }, function(err) {
                    console.log(err);
                })

            }else{

                reponse.status=201;
                reponse.message = 'Active you wallet!!';
                res.send(reponse);

            }

        }
    });
})

// api active account
app.get('/wallet/api/activeaccount/:email', function (req, res) {
    
    let emailusers = req.params.email;
    console.log(emailusers);

    if(emailusers)
    {    
        console.log("Connected!");
        var sql = `SELECT * FROM users  WHERE (email_users = '${emailusers}')`;
        connection.query(sql, function (err, result) {
            if (err) {
                reponse.status=404;
                reponse.message = err;
                res.send(reponse);
            }
            if (result) {
    
                if(result[0].active === 2)
                {
                    alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
                    console.log(alphanetFaucetAccount);

                    keystore = JSON.parse(result[0].keystore);
                    console.log(keystore);
    
                    secret = alphanetFaucetAccount.secret;

                     //request  initialize account
                     var initializePromise = initializeAccount();
                     initializePromise.then(function(result) {
                         console.log(` initializePromise Injected operation group id ${result.operationGroupID}`)
                         
                         res.send(reponseTransfert);
                         
                     }, function(err) {
                         console.log(err);

                     })
    
                }else{
    
                    reponse.status=201;
                    reponse.message = 'Active you wallet, get public and private key!!';
                    res.send(reponse);
    
                }
    
            }
        });


    }else {

        reponse.status=201;
        reponse.message = 'all fields must be filled';
        res.send(reponse);
    }
})

// api transfere Tezos
app.post('/wallet/api/transferetezos',function (req,res) {
    let emailusers = req.body.emailusers;
    pkhDestination = req.body.pkhdestination;
    amountTransfere = req.body.amount;
    feeTransfere = req.body.fee;

    console.log(req.body);
    if(pkhDestination && amountTransfere && feeTransfere && emailusers)
    {    
        console.log(emailusers);
        console.log("Connected!");
        var sql = `SELECT * FROM users  WHERE (email_users = '${emailusers}')`;
        connection.query(sql, function (err, result) {
            if (err) {
                reponse.status=404;
                reponse.message = err;
                res.send(reponse);
            }
            if (result) {
    
                if(result[0].active === 2)
                {
                    alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
                    console.log(alphanetFaucetAccount);

                    keystore = JSON.parse(result[0].keystore);
                    console.log(keystore);
    
                    secret = alphanetFaucetAccount.secret;


                    //transfere
                    var transferValuePromise = sendTransaction();
                    transferValuePromise.then(function(result) {
                        console.log(` transferValuePromise Injected operation group id ${result.operationGroupID}`);
                        let messageTransfert = `Injected operation group id ${result.operationGroupID}`;
                        var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                        console.log("Connected!");
                        var sql = `INSERT INTO transactiontezos (pkhsource,pkhdestination,amount,fee,datetrans) VALUES ('${alphanetFaucetAccount.pkh}', '${pkhDestination}','${amountTransfere}','${feeTransfere}','${datetime}')`;
                        connection.query(sql, function (err, result) {
                            if (err) {
                                reponse.status=404;
                                reponse.message = err;
                                res.send(reponse);
                            }

                            console.log("1 transaction inserted");

                            reponse.status=200;
                            reponse.message = messageTransfert;
                            res.send(reponse);
                        });

                    }, function(err) {
                        console.log(err);
                    }) 

    
                }else{
    
                    reponse.status=201;
                    reponse.message = 'Active you wallet, get public and private key!!';
                    res.send(reponse);
    
                }
    
            }
        });


    }else {

        reponse.status=201;
        reponse.message = 'all fields must be filled';
        res.send(reponse);
    }
})

//api les listes utilisateur
app.get('/wallet/api/find/:email', function (req, res) {
    
    let email = req.params.email;
    console.log(email);
    console.log("Connected!");
    var sql = `SELECT * FROM users  WHERE (email_users = '${email}')`;
    connection.query(sql, function (err, result) {
        if (err) {
            reponse.status=404;
            reponse.message = err;
            res.send(reponse);
        }
        if (result) {
            console.log(result);
            var alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
            console.log(alphanetFaucetAccount);
            result[0].alphFaucetAccount=alphanetFaucetAccount;
            var keystore = JSON.parse(result[0].keystore);
            console.log(keystore);
            result[0].keystore=keystore;



            res.send(result[0]);
        }
    });
})

//Authentification
app.post('/wallet/api/authentification',function (req,res) {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    console.log(password);
    console.log(req.body);

    if(email && password)
    {
            console.log("Connected!");
            var sql = `SELECT * FROM users  WHERE (email_users = '${email}')`;
            connection.query(sql, function (err, result) {
                if (err) {
                    reponse.status=404;
                    reponse.message = err;
                    res.send(reponse);
                }
                if(result.length>0)
                {
                    console.log(result[0]);

                    if(result[0].password_users === password)
                    {
                        req.session.users=result[0];
                       if ( result[0].alphFaucetAccount != null) {
                        var alphanetFaucetAccount = JSON.parse(result[0].alphFaucetAccount);
                        console.log(alphanetFaucetAccount);
                       // result[0].alphFaucetAccount=alphanetFaucetAccount;
                        
                        if (result[0].active=0 ) {reponse.pkh='vide';}else{ 
                            
                            reponse.pkh = alphanetFaucetAccount.pkh;
                        
                        }
                    }else{
                        reponse.pkh='vide';

                    }  
                        reponse.status=200;
                        reponse.message = 'Success connected !!';
                        console.log("Success connected !!");
                        res.send(reponse);

                    }else{
                        //res.render('auths/authentification', {error: `mot de passe incorrect veuillez renseigner le bon mot de passe`});

                        reponse.status=201;
                        reponse.message = 'incorrect password please fill in the correct password';
                        res.send(reponse);

                    }
                    console.log("ok");
                }else{
                    //res.render('auths/authentification', {error: `mot de passe incorrect veuillez renseigner le bon mot de passe`});

                    reponse.status=201;
                    reponse.message = 'Incorrect password or login';
                    res.send(reponse);

                }
            });

    }else {
        reponse.status=201;
        reponse.message = 'all fields must be filled';
        res.send(reponse);
    }
})

//create account
app.post('/wallet/api/creer',function (req,res) {
    let nomprenom = req.body.firstName +' '+req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body);
    console.log(nomprenom);
    console.log(email);
    console.log(password);
    if(nomprenom && email && password)
    {
        var sql = `SELECT * FROM users  WHERE (email_users = '${email}')`;
        connection.query(sql, function (err, result) {
            if (err) {
                reponse.status=404;
                reponse.message = err;
                res.send(reponse);
            }
            if(result.length>0)
            {              
                reponse.status=201;
                reponse.message = 'erreur Compte avec la meme adresse email existe deja';
                res.send(reponse);

            }else {
                    console.log("Connected!");
                    var sql = `INSERT INTO users (nom_prenom,email_users,password_users) VALUES ('${nomprenom}', '${email}','${password}')`;
                    connection.query(sql, function (err, result) {
                        if (err) {
                            reponse.status=404;
                            reponse.message = err;
                            res.send(reponse);
                        }
                        reponse.status=200;
                        reponse.message = '1 record inserted';
                        console.log("1 record inserted");
                        res.send(reponse);
                       
                      
                    });
            }
        });
 

    }else {

        reponse.status=201;
        reponse.message = 'all fields must be filled';
        res.send(reponse);
    }
})



app.get('/', (req, res) => res.render('pages/index'))


app.listen(PORT, function () {
    console.log(`application en cours a l'adresse 127.0.0.1:3000`)
})

