import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { AppConfig } from '../config/AppConfig';
import OpenAI from 'openai';
import { OpenaiService } from 'src/openai/openai.service';


@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private openai: OpenAI;

  // constructor() {
  //   this.openai = new OpenAI({
  //     apiKey: AppConfig.OPENAI_API_KEY,
  //   });
  // }
  constructor(private openaiService: OpenaiService) {}

  async handleUserMessage(number: string, message: string): Promise<void> {
    try {
      const reply = await this.openaiService.generateOpenAIResponse(message);
      await this.sendMessage(number, reply);
    } catch (e) {
      this.logger.error('Error handling user message:', e);
      await this.sendMessage(number, 'Sorry, I could not process your request.');
    }
  }

  async sendMessage(to: string, message: string): Promise<void> {
    let data = JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        //console.log(error);
        console.error('Axios error:', error.response?.data || error.message);
      });
  }

  async generateOpenAIResponse(prompt: string): Promise<string> {
     return this.openaiService.generateOpenAIResponse(prompt);
  //   try {
  //     const completion = await this.openai.chat.completions.create({
  //       model: 'gpt-4o-mini',
  //       messages: [{ role: 'user', content: prompt }],
  //     });
  //     return completion.choices[0].message?.content || 'No response';
  //   } catch (error) {
  //     this.logger.error('OpenAI error:', error);
  //     return 'Sorry, I could not process your request.';
  //   }
  // }
  }
}
