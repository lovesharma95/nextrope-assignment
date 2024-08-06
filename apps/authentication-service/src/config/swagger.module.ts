import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('TWT')
  .setDescription(
    'Swagger api documentation for track-work-time authentication'
  )
  .setVersion('1.0')
  .addSecurity('bearer', {
    type: 'http',
    scheme: 'bearer',
  })
  .addServer('http://localhost:3000')
  .addServer('http://localhost:3000', 'development')
  .addServer('http://localhost:3000', 'staging')
  .addServer('http://localhost:3000', 'production')
  .build();

export default swaggerConfig;
