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

 * [2022-03-11]: Added the save event for the settings. Only need to test now.
 * [2022-03-11][PHP API class]: Added a save method to save the settings
 * [2022-03-11]: Added the following settings in the settings area: (IMAP,SMTP,Timezone,Language and Administrator).
 * [2022-03-11]: Added a tooltip on the date of the email to display the full date.
 * [2022-03-11][PHP API class]: Added a list method to retrieve application settings.
 * [2022-03-11][PHP API class]: Added a isAdmin method to test if the loggedin user is the administrator.
 * [2022-03-11]: You can now enable debug by adding ```"debug": true,``` in the config/config.json file.
 * [2022-03-11][PHP MAILER class]: Fix logo. The logo will now be displayed only if link to file is provided.
 * [2022-03-11][PHP MAILER class]: Fix footer links. Only provided links will now be shown in the footer.
 * [2022-03-11]: Added support for an administrator
 * [2022-03-11]: Fixed the "Overflow-y when listing gets too long" issue
 * [2022-03-11]: Fixed an issue where the Sign Out function would cause the user to re-login with the session data.
 * [2022-03-11][PHP URL class]: Added a sanitize method.
 * [2022-03-11][JS Engine]: Added proper support for Pace. Pace loading is now accurate with the AJAX Requests
 * [2022-03-11]: Added a menu item settings only available to admin
 * [2022-03-11][PHP Auth class]: Changed the try method to use the builtin login method.
 * [2022-03-11][PHP Auth class]: Logged in user now accessible in $this->Auth->Username.
 * [2022-03-11][PHP Auth class]: try method renamed to authenticate and now handles all authentication steps previously split with the __construct method.
 * [2022-03-11]: Added a default timezone of 'America/Toronto' now accessible in $this->Timezone and Engine.Storage.get('timezone').
 * [2022-03-10]: Fix a bug in the Javascript Engine where Debug was always turned on.
 * [2022-03-10]: MAIL class rename MAILER.
 * [2022-03-10]: PHPIMAP class rename IMAP.
 * [2022-03-10]: Added support for aliases.
 * [2022-03-10]: Added a new restoring method. You can now choose between resend or copy. Default is copy.
 * [2022-03-10][PHP IMAP class]: Added support of multiple IMAP connections.
 * [2022-03-10][PHP IMAP class]: Added a changeFolder method.
 * [2022-03-10][PHP IMAP class]: Revisited the saveEml method and renamed it getEml.
 * [2022-03-10][PHP IMAP class]: Added a saveEml method to save an eml into a mailbox.
 * [2022-03-10][PHP IMAP class]: Added a __destruct method to close the main IMAP connection.
 * [2022-03-10][PHP IMAP class]: Added a buildConnectionString method to build a mailbox string.
 * [2022-03-10][PHP IMAP class]: Added a connect method to connect a mailbox.
 * [2022-03-10]: A new logging system has been added.
 * [2022-03-10]: Multiple fixes to the PHPIMAP class.
 * [2022-03-10][PHP PHPIMAP class]: created a new method formatMsgs to format the messages array.
 * [2022-03-10][PHP PHPIMAP class]: Added UNSEEN email count to the search method.
 * [2022-03-10][PHP PHPIMAP class]: Added default criteria to the search method.
 * [2022-03-10][PHP PHPIMAP class]: Live IMAP Connections are now saved in the IMAP Property.
 * [2022-03-10][PHP PHPIMAP class]: Closing the IMAP connection on successful login.
 * [2022-03-10]: 1 fix to the MAIL class.
 * [2022-03-10][PHP MAIL class]: Clearing attachments before adding the new one.
 * [2022-03-10]: 1 fix to the API class.
 * [2022-03-10][PHP API class]: Fixing the creation of the tmp directory.

## Known Issues

 * Need a page to change settings
 * Need to add some site settings in the installation wizard. (Administrator and Aliases)(Also need to test the login of the Administrator to prevent lockout)
