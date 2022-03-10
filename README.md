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

 * [2022-03-10]: A new logging system has been added.
 * [2022-03-10]: Multiple fixes to the PHPIMAP class.
 * [2022-03-10][PHPIMAP class]: created a new method formatMsgs to format the messages array.
 * [2022-03-10][PHPIMAP class]: Added UNSEEN email count to the search method.
 * [2022-03-10][PHPIMAP class]: Added default criteria to the search method.
 * [2022-03-10][PHPIMAP class]: Live IMAP Connections are now saved in the IMAP Property.
 * [2022-03-10]: 1 fix to the MAIL class.
 * [2022-03-10][MAIL class]: Clearing attachments before adding the new one.
 * [2022-03-10]: 1 fix to the API class.
 * [2022-03-10][API class]: Fixing the creation of the tmp directory.
