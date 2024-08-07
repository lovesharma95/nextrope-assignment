import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('TWT')
  .setDescription(
    'Swagger api documentation for track-work-time project management'
  )
  .setVersion('1.0')
  .addSecurity('bearer', {
    type: 'http',
    scheme: 'bearer',
  })
  .addServer('http://localhost:3002')
  .addServer('http://localhost:3002', 'development')
  .addServer('http://localhost:3002', 'staging')
  .addServer('http://localhost:3002', 'production')
  .build();

export default swaggerConfig;
