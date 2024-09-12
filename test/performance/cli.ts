import { performance, PerformanceObserver } from "perf_hooks";
import { CLI } from "../../lib/cli";

// Performance observer setup
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(
      `[Performance] ${entry.name} took ${entry.duration.toFixed(2)} ms`
    );
  });
});
obs.observe({ entryTypes: ["measure"], buffered: true });

// Log memory usage
function logMemoryUsage(label: string) {
  const memoryUsage = process.memoryUsage();
  console.log(
    `[Memory Usage - ${label}] RSS: ${(memoryUsage.rss / (1024 * 1024)).toFixed(
      2
    )} MB`
  );
  console.log(
    `[Memory Usage - ${label}] Heap Total: ${(
      memoryUsage.heapTotal /
      (1024 * 1024)
    ).toFixed(2)} MB`
  );
  console.log(
    `[Memory Usage - ${label}] Heap Used: ${(
      memoryUsage.heapUsed /
      (1024 * 1024)
    ).toFixed(2)} MB`
  );
  console.log(
    `[Memory Usage - ${label}] External: ${(
      memoryUsage.external /
      (1024 * 1024)
    ).toFixed(2)} MB`
  );
}

// Setup a much larger database for testing
async function setupLargeDatabase() {
  const start = performance.now();
  logMemoryUsage("Before Setup");
  performance.mark("setupLargeDatabase-start");
  console.log("Setting up large database for heavy testing...");

  await CLI.CONFIG.run("DROP TABLE IF EXISTS users");
  await CLI.CONFIG.run("DROP TABLE IF EXISTS test");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL
    );
  `;
  await CLI.CONFIG.run(createTableQuery);

  const chunkSize = 1000; // Larger chunk size
  const totalUsers = 1000000; // 1 million users

  for (let i = 0; i < totalUsers; i += chunkSize) {
    const chunk = Array.from(
      { length: chunkSize },
      (_, j) => `('User${i + j + 1}')`
    ).join(",");
    const insertDataQuery = `
      INSERT INTO users (name)
      VALUES ${chunk};
    `;
    await CLI.CONFIG.run(insertDataQuery);
  }

  console.log("Database setup with 1 million users completed.");
  performance.mark("setupLargeDatabase-end");
  performance.measure(
    "setupLargeDatabase-duration",
    "setupLargeDatabase-start",
    "setupLargeDatabase-end"
  );
  const end = performance.now();
  const timeTaken = end - start;
  console.log(`Create 1 million users ${timeTaken} ms`);
  logMemoryUsage("After Setup");
}

(async () => {
  CLI.CONFIG.configure("mariadb", "-u mahdi -proot");
  await CLI.CONFIG.run("CREATE DATABASE IF NOT EXISTS test_db");
  CLI.CONFIG.use("test_db");
  // Setup large database and execute performance tests
  await setupLargeDatabase();
  obs.disconnect();
})();
