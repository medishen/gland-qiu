export class RateLimit {
  private maxRequests: number;
  private timeWindow: number;
  private requestTimestamps: number[] = [];

  constructor(maxRequests: number, timeWindow: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow; // Time window in milliseconds
  }

  // Check if the request is allowed
  isAllowed(): boolean {
    const currentTime = Date.now();

    // Remove timestamps outside of the time window
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => currentTime - timestamp <= this.timeWindow
    );

    if (this.requestTimestamps.length < this.maxRequests) {
      this.requestTimestamps.push(currentTime);
      return true;
    } else {
      return false;
    }
  }

  // Wait until the rate limit is available
  async waitForAvailability(): Promise<void> {
    const currentTime = Date.now();
    const nextAvailableTime = Math.max(
      this.requestTimestamps[0] + this.timeWindow - currentTime,
      0
    );

    if (nextAvailableTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, nextAvailableTime));
    }
  }
}


