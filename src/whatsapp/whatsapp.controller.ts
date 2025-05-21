import { Controller,Get, Logger, Post, Req, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

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
  const payload = req.body?.entry;

  try {
    if (!Array.isArray(payload) || payload.length === 0) {
      this.logger.error('Invalid webhook payload: no entry found');
      return res.status(400).send('Bad Request');
    }

    const change = payload[0]?.changes?.[0]?.value;
    const messages = change?.messages;
    const contacts = change?.contacts;

    // Ignore non-message events
    if (!Array.isArray(messages) || messages.length === 0 || !Array.isArray(contacts) || contacts.length === 0) {
      this.logger.warn('Ignored webhook: not a user message');
      return res.sendStatus(200); // Acknowledge to avoid retries
    }

    const message = messages[0];
    const contact = contacts[0];

    const senderNumber = contact.wa_id;
    const messageText = message?.text?.body || '';
    const senderName = contact.profile?.name || 'Unknown';

    this.logger.log(`Sender Number: ${senderNumber}`);
    this.logger.log(`Message: ${messageText}`);
    this.logger.log(`Sender Name: ${senderName}`);

    // Process the message
    await this.whatsappService.handleUserMessage(senderNumber, messageText);

    return res.sendStatus(200);
  } catch (error) {
    this.logger.error('Error handling webhook:', error);
    return res.sendStatus(500);
  }
}

}