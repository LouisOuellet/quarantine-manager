![Quarantine Manager](/dist/img/logo.png)

# Quarantine Manager - Manage your quarantined emails using IMAP
![License](https://img.shields.io/github/license/LouisOuellet/quarantine-manager?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/LouisOuellet/quarantine-manager?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/LouisOuellet/quarantine-manager?style=for-the-badge)
![GitHub version](https://img.shields.io/badge/version-22.03--11-green?style=for-the-badge)

## Features

## Why you might need it

## Can I use this?
If your email server is setup so that you have a dedicated mailbox for quarantined items, this project is for you.

## Does it work with ISPConfig
Yes! This is actually why I wrote the application.

## Screenshots
See [Screenshots](screenshots).

## License
This software is distributed under the [MIT](https://en.wikipedia.org/wiki/MIT_License) license. Please read [LICENSE](LICENSE) for information on the software availability and distribution.

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

 * signing out requires browser refresh
 * sort messages by date
 * Add messages count at bottom
 * SMTP Authentication seems to always accept all logins
 * Missing restore method settings
 * Missing aliases settings
 * Need to add some site settings in the installation wizard. (Administrator and Aliases)(Also need to test the login of the Administrator to prevent lockout)
