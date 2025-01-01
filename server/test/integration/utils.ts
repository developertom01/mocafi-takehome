import { Logger } from "../../src/internal/logger";
import pino from "pino";

export function getMockLogger(): [Logger, string[]] {
  const logs: string[] = [];

  const pinoLogger = pino(
    {},
    {
      write: (log: string) => {
        const data = JSON.parse(log.trim());
        delete data.responseTime;
        delete data.time;
        delete data.hostname;
        delete data.pid;
        //id is unpredictable
        delete data.id;

        //user.id is unpredictable
        if ("user.id" in data) {
          delete data["user.id"];
        }

        //Replace data.req.url that has form /api/users/1 to /api/users/:id
        if ("req" in data && "url" in data.req) {
          data.req.url = data.req.url.replace(/\d+/, ":id");
        }

        logs.push(data);
      },
    }
  );

  return [pinoLogger, logs];
}
