const {APP_PASS, EMAIL} =  require("../secret")

const nodemailer = require("nodemailer")


module.exports.sendMail=async function sendMail(data,req,res) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: EMAIL,
          pass: APP_PASS
        }
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        console.log("i am in");
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Hey 👻" <abc@gmail.com>', // sender address
          to: data.email,//"bar@example.com, baz@example.com", // list of receivers
          subject: data.subject, // Subject line
          text: "reset password link", // plain text body
          html: data.message, // html body
          
        });
        console.log("i am out");
        console.log("Message sent: %s ", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        
      }
      
      main().catch(console.error.message);
}



