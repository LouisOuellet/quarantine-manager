# Quarantine Manager
PHP application to manage quarantined emails using IMAP.

## Can I use this?
If your email server is setup so that you have a dedicated mailbox for quarantined items, this project is for you.

## Does it work with ISPConfig
Yes! This is actually why I wrote the application.

## Requirements
A web server with php-imap installed.

## How to
### Setup
Simply copy the files into a root directory of your website. Once done simply visit the site. An installation wizard will be waiting for you.

## ChangeLog

 * [2022-03-10]: MAIL class rename MAILER.
 * [2022-03-10]: PHPIMAP class rename IMAP.
 * [2022-03-10]: Added support for aliases.
 * [2022-03-10]: Added a new restoring method. You can now choose between resend or copy. Default is copy.
 * [2022-03-10][IMAP class]: Added support of multiple IMAP connections.
 * [2022-03-10][IMAP class]: Added a changeFolder method.
 * [2022-03-10][IMAP class]: Revisited the saveEml method and renamed it getEml.
 * [2022-03-10][IMAP class]: Added a saveEml method to save an eml into a mailbox.
 * [2022-03-10][IMAP class]: Added a __destruct method to close the main IMAP connection.
 * [2022-03-10][IMAP class]: Added a buildConnectionString method to build a mailbox string.
 * [2022-03-10][IMAP class]: Added a connect method to connect a mailbox.
 * [2022-03-10]: A new logging system has been added.
 * [2022-03-10]: Multiple fixes to the PHPIMAP class.
 * [2022-03-10][PHPIMAP class]: created a new method formatMsgs to format the messages array.
 * [2022-03-10][PHPIMAP class]: Added UNSEEN email count to the search method.
 * [2022-03-10][PHPIMAP class]: Added default criteria to the search method.
 * [2022-03-10][PHPIMAP class]: Live IMAP Connections are now saved in the IMAP Property.
 * [2022-03-10][PHPIMAP class]: Closing the IMAP connection on successful login.
 * [2022-03-10]: 1 fix to the MAIL class.
 * [2022-03-10][MAIL class]: Clearing attachments before adding the new one.
 * [2022-03-10]: 1 fix to the API class.
 * [2022-03-10][API class]: Fixing the creation of the tmp directory.

## Known Issues

 * Bad Overflow-y when listing gets too long
 * Need a page to change settings
