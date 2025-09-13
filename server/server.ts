import { connectDB } from "../dbContext";
import app from "../server/app";

(async () => {
  await connectDB();
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => console.log(`HTTP on :${port}`));
})();
