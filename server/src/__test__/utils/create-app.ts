import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AppModule } from "../../modules/app/infrastructure/nest/module/app.module"

// A fresh application per test: the in-memory repositories and the throttler
// counters live in it, so no test sees what another one did.
export async function createApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile()
  const app = module.createNestApplication({ logger: false })

  await app.init()

  return app
}
