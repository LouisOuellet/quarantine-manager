# Quarantine Manager Change Log

## Version 22.03-14

 * Fix issue: administrator without password prevents saving settings.
 * Default restoration method is now set during application initialization. So if you didn't have set the setting, the application still sets it in $this->Settings['method'].
 * Fix issue: SMTP Authentication seems to always accept all logins.
 * Added the restoration method settings in the settings panel.
 * Added the aliases settings in the settings panel.
 * Added counts on dashboard.
 * Made the Settings's header fix position.
 * Made the Settings's footer fix position.
 * Made the Dashboard's header fix position.
 * Made the Dashboard's footer fix position.
 * Fix issue: signing out requires browser refresh

## Version 22.03-12

 * Added a confirmation before deletion.

## Version 22.03-11

 * PHP IMAP class: Found 3 typos. (encyption => encryption)
 * Added the save event for the settings. Only need to test now.
 * PHP API class: Added a save method to save the settings
 * Added the following settings in the settings area: (IMAP,SMTP,Timezone,Language and Administrator).
 * Added a tooltip on the date of the email to display the full date.
 * PHP API class: Added a list method to retrieve application settings.
 * PHP API class: Added a isAdmin method to test if the loggedin user is the administrator.
 * You can now enable debug by adding ```"debug": true,``` in the config/config.json file.
 * PHP MAILER class: Fix logo. The logo will now be displayed only if link to file is provided.
 * PHP MAILER class: Fix footer links. Only provided links will now be shown in the footer.
 * Added support for an administrator
 * Fixed the "Overflow-y when listing gets too long" issue
 * Fixed an issue where the Sign Out function would cause the user to re-login with the session data.
 * PHP URL class: Added a sanitize method.
 * JS Engine: Added proper support for Pace. Pace loading is now accurate with the AJAX Requests
 * Added a menu item settings only available to admin
 * PHP Auth class: Changed the try method to use the builtin login method.
 * PHP Auth class: Logged in user now accessible in $this->Auth->Username.
 * PHP Auth class: try method renamed to authenticate and now handles all authentication steps previously split with the __construct method.
 * Added a default timezone of 'America/Toronto' now accessible in $this->Timezone and Engine.Storage.get('timezone').

## Version 22.03-10

 * Fix a bug in the Javascript Engine where Debug was always turned on.
 * MAIL class rename MAILER.
 * PHPIMAP class rename IMAP.
 * Added support for aliases.
 * Added a new restoring method. You can now choose between resend or copy. Default is copy.
 * PHP IMAP class: Added support of multiple IMAP connections.
 * PHP IMAP class: Added a changeFolder method.
 * PHP IMAP class: Revisited the saveEml method and renamed it getEml.
 * PHP IMAP class: Added a saveEml method to save an eml into a mailbox.
 * PHP IMAP class: Added a __destruct method to close the main IMAP connection.
 * PHP IMAP class: Added a buildConnectionString method to build a mailbox string.
 * PHP IMAP class: Added a connect method to connect a mailbox.
 * A new logging system has been added.
 * Multiple fixes to the PHPIMAP class.
 * PHP IMAP class: created a new method formatMsgs to format the messages array.
 * PHP IMAP class: Added UNSEEN email count to the search method.
 * PHP IMAP class: Added default criteria to the search method.
 * PHP IMAP class: Live IMAP Connections are now saved in the IMAP Property.
 * PHP IMAP class: Closing the IMAP connection on successful login.
 * 1 fix to the MAIL class.
 * PHP MAILER class: Clearing attachments before adding the new one.
 * 1 fix to the API class.
 * PHP API class: Fixing the creation of the tmp directory.
