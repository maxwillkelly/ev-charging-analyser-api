import { Body, Controller, Post } from '@nestjs/common';
import { VerifyWebhookDto, WebhookDto } from './dtos/webhook.dto';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async recordWebhookDto(
    @Body() dto: WebhookDto,
  ): Promise<VerifyWebhookDto | boolean> {
    return await this.webhookService.recordWebhookAsync(dto);
  }
}
