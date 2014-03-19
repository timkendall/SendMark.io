/**
 * Mail Listener 2
 */
var MailListener = require("mail-listener2"),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    List = mongoose.model('List'),
    Link = mongoose.model('Link'),
    SendMarkMailman = require("sendmark-mailman").Mailman;

var mailListener;
  Mailman = new SendMarkMailman();

if (!String.prototype.trim) {
   //code for trim
   String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g, '');
   };
}

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

        console.log(senderAddress + ' is not a registered user.');
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

  });
};

exports.start = function(){
    mailListener.start();
};