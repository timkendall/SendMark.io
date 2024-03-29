/**
 * Mail Listener 2
 */
var MailListener = require("mail-listener2"),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    List = mongoose.model('List'),
    Link = mongoose.model('Link'),
    config = require('../../config/config'),
    UserApp = require('userapp'),
    SendMarkMailman = require("sendmark-mailman").Mailman;

// Initialzie UserApp
UserApp.initialize({
  app_id: '52e93bb22f2fa'
});

var mailListener;
  Mailman = new SendMarkMailman();

exports.configListener = function() {
  mailListener = new MailListener({
    username: "sendmarkadd@gmail.com",
    password: "thisisatest!",
    host: "imap.gmail.com",
    port: 993, // imap port
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true} // options to be passed to mailParser lib.
  });

  mailListener.on("server:connected", function(){
    console.log("imapConnected");
  });

  mailListener.on("server:disconnected", function(){
    console.log("imapDisconnected");
    // Reconnect
    try {
      process.nextTick(function() {
        mailListener.start();
      });
    } catch (error) {
      console.log('Error connecting to mail server: ' + error);
    }
  });

  mailListener.on("error", function(err){
    console.log(err);
    // Reconnect
    try {
      process.nextTick(function() {
        mailListener.start();
      });
    } catch (error) {
      console.log('Error connecting to mail server: ' + error);
    }

  });

  mailListener.on("mail", function(mail) {
    var senderAddress;


    /**
      * Parse/Validate Message
      *
      * 1) Split valid urls in subject into arrays
      * 2) Extract categories and tags for each url
      *
      */

    console.log("From:", mail.from);
    console.log("Subject:", mail.subject);

    senderAddress = mail.from[0].address;

    /*if( typeof mail.subject === 'undefined' )
      return console.log('Email contained no links.')*/

    /**
      * Generate List and Link Objects
      *
      * 1) Recieve mail
      * 2) Parse mail and extract email address, link(s), categories, and tags
      * 3) Get user identified by email address
      * 4) IF no user found, save data, send email to that address inviting them to signup
      * 5) ELSE user found, check if link already exists, if it does add any new data to it
      * 6) Check if category(s) exist, create if they don't
      *
      */

    User.findOne( { email: senderAddress } ).exec(function (err, user) {
      if (err) console.log(err);
      if (!user) {
        // Todo: Send invite to unregistered user

        // Maybe we don't have local copy cached, check UserApp
        UserApp.User.search({
          "page": 1,
          "page_size": 1,
          "fields": "mixed",
          "filters": [
            {
              "email": mail.sender
            }
          ]
        }, function (error, result) {
            console.log("UserApp: " + JSON.stringify(error) + " -- " + result);
            // Handle error/result
            if (!result) return;
            if (result.length > 1) return;

            user = result[0];
        });
      }

      if (!user) {
        console.log(senderAddress + ' is not a registered user.');
        return;
      }

      // Extract Links and Generate Link Objects
      Mailman.extractLinks(user, mail, function (links) {
        if (!links) return;

        // Print links to console (should also save to console so we can see how we're doing on parsing (i.e Winston). )
        links.forEach(function (link, index, array) {
          console.log(link);
        });

        // Save Links, save links to categories
        // [OPTIMIZATION] Alredy have Link objects, just 'save' instead of create?
        Link.create( links, function (error) {
          if (error) return console.log(error);
          console.log('Saved link for ' + user.email);
        });
      });

    });

  });
};

exports.start = function (){
    mailListener.start();
};

exports.log = function (req, res) {
  console.log('Mailgun POST: ' + req.body.subject);
};

exports.parse = function (req, res) {

  //console.log(JSON.stringify(req.body));
  console.log('Mailgun SENDER: ' + req.body.sender);
  console.log('Mailgun SUBJECT: ' + req.body.subject);
  console.log('Mailgun body-plain: ' + req.body['body-plain']);

  if (!req.body.sender) res.send(200);
  if (!req.body.subject) res.send(200);

  var mail = {
    sender: req.body.sender,
    subject: req.body.subject,
    text: req.body['body-plain'] || ''
  }

  User.findOne( { email: mail.sender } ).exec(function (err, user) {
      if (err) console.log(err);
      if (!user) {
        // Todo: Send invite to unregistered user
        console.log(mail.sender + ' is not a registered user.');
      } else {
        // Extract Links and Generate Link Objects
        Mailman.extractLinks(user, mail, function (links) {
          if (!links) return;

          // Print links to console (should also save to console so we can see how we're doing on parsing (i.e Winston). )
          links.forEach(function (link, index, array) {
            console.log(link);
          });

          // Save Links, save links to categories
          // [OPTIMIZATION] Alredy have Link objects, just 'save' instead of create?
          Link.create( links, function (error) {
            if (error) return console.log(error);
            console.log('Saved link for ' + user.email);
          });
        });
      }
    });

    res.send(200);

}