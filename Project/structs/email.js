class Email {
    constructor(to, subject, text = null, html = null, attachments = null) {
      if (!to || !subject) {
        throw new Error('To and Subject fields are mandatory');
      }
      this.to = to;
      this.subject = subject;
      this.text = text;
      this.html = html;
      this.attachments = attachments;
    }
  }
  
  module.exports = Email;
  