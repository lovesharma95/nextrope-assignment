import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('TWT')
  .setDescription('Swagger api documentation for track-work-time time tracking')
  .setVersion('1.0')
  .addSecurity('bearer', {
    type: 'http',
    scheme: 'bearer',
  })
  .addServer('http://localhost:3003')
  .addServer('http://localhost:3003', 'development')
  .addServer('http://localhost:3003', 'staging')
  .addServer('http://localhost:3003', 'production')
  .build();

export default swaggerConfig;
