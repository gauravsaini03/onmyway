/**
 * BidController
 *
 * @description :: Server-side logic for managing bids
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var gcm = require('node-gcm');
var message = new gcm.Message();
var sender = new gcm.Sender('AIzaSyDlogF2t42Ep5940UE7vJFMLHwWClsp6LI');

module.exports = {
	new: function(req,res){
        Bid.create(req.body).exec(function createCB(err, created){
            if(err) {
                res.json({error:err});
            }
            if(created === undefined){
                res.notFound();
            } else{
                res.json({success:true});

                message.addData('title', "New Bid");
                message.addData('message', 'Amount: '+req.body.amount+' '+'from: ' + req.body.userid);

                var regIds = [];
                Push.findByType('seller').exec(function createCB(err, res){

                    res.forEach(function(key){
                        regIds.push(key.regid);
                    })

                    sender.send(message, regIds, function (err, result) {
                        if(err) console.error(err);
                        else    console.log(result);
                    });

                    sender.sendNoRetry(message, regIds, function (err, result) {
                        if(err) console.error(err);
                        else    console.log(result);
                    });

                });
                
            }
        });
    }
};

