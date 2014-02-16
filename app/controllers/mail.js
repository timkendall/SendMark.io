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

exports.configListener = function(){
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
    process.nextTick(function() {
      mailListener.start();
    });
  });

  mailListener.on("error", function(err){
    console.log(err);
  });

  mailListener.on("mail", function(mail) {
    var links,
      from,
      subject,
      body;

    /**
      * Parse Message
      *
      * 1) Split valid urls in subject into arrays
      * 2) Extract categories and tags for each url
      *
      */

    console.log("From:", mail.from);
    console.log("Subject:", mail.subject);

    from = mail.from[0].address;

    if( typeof mail.subject === 'undefined' ) {
      subject = "";
    } else {
      subject = mail.subject.split(',');
    }

    body = mail.text;

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

    User.findOne( { email: from } ).exec(function( err, user ) {
      if (err) console.log(err);
      if ( !user ) {
        // Todo: Send invite to unregistered user

        console.log('Not user' + from);
      } else {
        // Extract links
        links = Mailman.extractLinks( user, subject, body);
        console.log('Extracted links');
        if(!links) return console.log( 'No links found');

        // Print links to console
        links.forEach(function( link, index, array ) {
          console.log(link);
        });
        // Save Links, save links to categories
        Link.create( links, function( error ) {
          if(error) return console.log( error );
          console.log('Saved link');
        });
      }
    });
  });
};

exports.start = function(){
    mailListener.start();
};