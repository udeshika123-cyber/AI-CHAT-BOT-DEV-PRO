import { Controller,Get, Logger, Module, Post, Req, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [ConfigModule.forRoot()],
// })

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
    constructor(private whatsappService:WhatsappService) {}

    @Get('test')
    test(){
        return 'prabhashi';
    }

    @Get('webhook')
    challengeWebhook(@Req() req, @Res() res) {
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
        // Check if a token and mode is in the query string of the request
        if (mode && token) {
          // Check the mode and token sent is correct
          if (mode === "subscribe" && token === process.env.WHATSAPP_CHALLANGE_KEY) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
          } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
          }
        }
    }

    // @Post('webhook')
    // async handleWebhook(@Req() req, @Res() res) {
    //    //this.logger.log('Webhook Payload:', JSON.stringify(req.body, null, 2));

    //     const payload = req.body.entry;
    //     try {
    //       const change = payload[0].changes[0].value;
    //       const senderNumber = Array.isArray(change.contacts) && change.contacts.length > 0 ? change.contacts[0].wa_id : null;

    //       const messageText = change.messages[0].text.body;
    //       const senderName = change.contacts[0].profile.name;

    //       this.logger.log(`Sender Number: ${senderNumber}`);
    //       this.logger.log(`Message: ${messageText}`);
    //       this.logger.log(`Sender Name: ${senderName}`);

    //       // Generate OpenAI response
    //       await this.whatsappService.handleUserMessage(senderNumber, messageText);

    //       res.sendStatus(200); // Respond with 200 OK to acknowledge receipt of the message
    //     } catch (e) {
    //       this.logger.error(e);
    //       res.sendStatus(500);
    //     }
    // }


    @Post('webhook')
async handleWebhook(@Req() req, @Res() res) {
  const payload = req.body.entry;

  try {
    const change = payload?.[0]?.changes?.[0]?.value;
    const contacts = change?.contacts;
    const messages = change?.messages;

    const senderNumber = Array.isArray(contacts) && contacts.length > 0 ? contacts[0].wa_id : null;
    const messageText = Array.isArray(messages) && messages.length > 0 ? messages[0].text?.body : null;
    const senderName = contacts?.[0]?.profile?.name || 'Unknown';

    this.logger.log(`Sender Number: ${senderNumber}`);
    this.logger.log(`Message: ${messageText}`);
    this.logger.log(`Sender Name: ${senderName}`);

    // Optionally send a reply here using whatsappService
    //await this.whatsappService.sendMessage(senderNumber, 'Hello from the bot!');
    if (senderNumber && messageText) {
      await this.whatsappService.sendMessage(senderNumber, 'Hello from Nest Js?');
    }

    res.sendStatus(200);
  } catch (error) {
    this.logger.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
}


}