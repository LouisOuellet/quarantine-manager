![Quarantine Manager](/dist/img/logo.png)

# Quarantine Manager - Manage your quarantined emails using IMAP
![License](https://img.shields.io/github/license/LouisOuellet/quarantine-manager?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/LouisOuellet/quarantine-manager?style=for-the-badge&logo=github)
![GitHub top language](https://img.shields.io/github/languages/top/LouisOuellet/quarantine-manager?style=for-the-badge&logo=php)
![GitHub version](https://img.shields.io/badge/version-22.03--14-green?style=for-the-badge)

## Features
 - Simple interface
 - You can choose between 2 restorations methods. Resend or Copy. Resend will save the quarantined email in a .eml file and send it to the user's mailbox. While the copy method will simply create a copy of the quarantined email into the user's mailbox.
 - Restore or delete multiple emails at once.
 - Support for aliases. So 1 user can access the quarantined emails of multiple accounts.

## Why you might need it
Do you have a dedicated mailbox do save all the emails Amavis and Rspamd filters? How do you manage it? Wouldn't you want users to handle their own quarantine emails? Well this tool allows multiple users to manage the quarantine mailbox.

## Does it work with ISPConfig
Yes! This is actually why I wrote the application.

### Spam Policy example
See [Spam Policy](SPAMPOLICY.md).

## Can I use this?
If your email server is setup so that you have a dedicated mailbox for quarantined items, this project is for you.

### License
This software is distributed under the [MIT](https://en.wikipedia.org/wiki/MIT_License) license. Please read [LICENSE](LICENSE) for information on the software availability and distribution.

## Screenshots
See [Screenshots](screenshots).

## Localization
Quarantine Manager defaults to English, but in the [language](dist/languages/) folder you'll find many translations for Quarantine Manager error messages that you may encounter.

We welcome corrections and new languages.

## Requirements
A web server with php-imap installed.

## Installation
Simply copy the files into a root directory of your website.

```sh
git clone https://github.com/LouisOuellet/quarantine-manager
```

Once done simply visit the site, an installation wizard will be waiting for you.

## Changelog
See [changelog](CHANGELOG.md).

## Security
Please disclose any vulnerabilities found responsibly – report security issues to the maintainers privately.

## Known Issues

 * sort messages by date

## Upcomming features

 * Need to add some site settings in the installation wizard. (Administrator and Aliases)(Also need to test the login of the Administrator to prevent lockout)
