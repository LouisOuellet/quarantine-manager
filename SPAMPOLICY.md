# Example of a Spam Filter policy in ISPConfig

## Policy
 * Virus Lover : No
 * SPAM Lover : No
## Amavis
 * Settings
   * Banned files lover : No
   * Bad header lover : No
   * Bypass virus checks : No
   * Bypass banned checks : No
   * Bypass header checks : No
 * Tag-Level
   * SPAM tag level : 3.0
   * SPAM tag2 level : 5.0
   * SPAM kill level : 5.0
   * SPAM dsn cutoff level : 8.0
   * SPAM quarantine cutoff level : 10.0
   * SPAM modifies subject : Yes
   * SPAM subject tag : [SPAM]
   * SPAM subject tag2 : [WARNING][SPAM]
   * Quarantine (Where you specify you're quarantine mailbox)
   * Forward virus to email : quarantine@domain.com
   * Forward spam to email : quarantine@domain.com
   * Forward banned to email : quarantine@domain.com
   * Forward bad header to email : quarantine@domain.com
 * Other
   * Addr. extension virus :
   * Addr. extension SPAM :
   * Addr. extension banned :
   * Addr extension bad header :
   * Warn virus recip : Yes
   * Warn banned recip : Yes
   * Warn bad header recip : Yes
   * Newvirus admin : support@domain.com
   * Virus admin : support@domain.com
   * Banned admin : support@domain.com
   * Bad header admin : support@domain.com
   * SPAM admin : support@domain.com
   * Message size limit : 40000000 Bytes
   * Banned rulenames :
## Rspamd
 * Greylisting level : 2.5
 * SPAM tag level : 4.0
 * SPAM tag method : Header (adds "X-spam: Yes")
 * SPAM reject level : 10
