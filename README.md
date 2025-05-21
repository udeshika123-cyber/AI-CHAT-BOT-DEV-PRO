# WhatsApp + OpenAI NestJS Bot

This project is a NestJS application that integrates WhatsApp messaging with OpenAI's GPT models. It allows you to receive WhatsApp messages via webhook, generate AI-powered responses using OpenAI, and send replies back to users automatically.

## Features

- WhatsApp webhook endpoint for message reception and verification
- Automatic response generation using OpenAI (GPT-4o-mini or GPT-3.5-turbo)
- Modular NestJS structure
- Environment-based configuration

## Project Structure

```
src/
  app.controller.ts         # Basic NestJS controller
  app.module.ts             # Main application module
  app.service.ts            # Basic service
  main.ts                   # Application entry point
  config/
    AppConfig.ts            # Loads environment variables for API keys, etc.
  openai/
    openai.service.ts       # (Legacy) OpenAI service (logic now in whatsapp.service)
  whatsapp/
    whatsapp.controller.ts  # Handles WhatsApp webhook endpoints
    whatsapp.service.ts     # Handles WhatsApp API and OpenAI integration
```

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```powershell
   npm install
   ```
3. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
   WHATSAPP_API_VERSION=v19.0
   WHATSAPP_API_URL=https://graph.facebook.com
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_CHALLANGE_KEY=your_webhook_verify_token
   OPENAI_API_KEY=your_openai_api_key
   PORT=3000
   ```
4. **Run the application**
   ```powershell
   npm run start:dev
   ```

## Endpoints

- `GET /whatsapp/webhook` - WhatsApp webhook verification
- `POST /whatsapp/webhook` - Receives WhatsApp messages and triggers OpenAI response
- `GET /whatsapp/test` - Simple test endpoint

## How it Works

- WhatsApp sends a message to your webhook
- The controller extracts the message and sender info
- `WhatsappService` generates a reply using OpenAI and sends it back via WhatsApp API

## Dependencies

- [NestJS](https://nestjs.com/)
- [OpenAI Node.js SDK](https://www.npmjs.com/package/openai)
- [Axios](https://www.npmjs.com/package/axios)

## Testing

- Unit tests are provided for controllers and services in the `src/whatsapp` and `src/openai` folders.
- Run tests with:
  ```powershell
  npm test
  ```

## License

This project is for educational/demo purposes.
