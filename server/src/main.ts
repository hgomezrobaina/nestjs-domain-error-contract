import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./modules/app/infrastructure/nest/module/app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
