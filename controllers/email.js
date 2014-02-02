/**
 * Mail Listener 2
 */
var MailListener = require("mail-listener2");
var mailListener;

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
	});

	mailListener.on("error", function(err){
	  console.log(err);
	});

	mailListener.on("mail", function(mail){
	  // do something with mail object including attachments
	  console.log("From:", mail.from);
	  console.log("Subject:", mail.subject);
	  var subject = mail.text.split('#');
	  var tags = new Array();
	  for(var i = 0; i < subject.length; ++i){
	  	var hashtag = subject[i].trim();
	  	if(hashtag){
	  		tags.push(hashtag);
	  	}
	  }
	  console.log(tags);
	  // mail processing code goes here
	});
}

exports.start = function(){
	mailListener.start();
};