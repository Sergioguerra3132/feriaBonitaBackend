const CircuitBreaker = require('opossum');
const fs = require('fs');
const path = require('path');

class CircuitBreakerHandler {
  constructor() {
    this.options = {
      timeout: 3000, // time in ms
      errorThresholdPercentage: 50,
      resetTimeout: 30000, // time in ms
    };
  }

  static createBreaker(func) {

    const breaker = new CircuitBreaker(func, this.options);

    breaker.fallback(() => {
      this.logToFile('Circuit open. Using fallback.');
    });

    breaker.on('failure', (error) => {
      // Log the specific error here
      this.logToFile(`Action failed: ${error}`);
    });

    breaker.on('open', () => {
      this.logToFile('Circuit has been opened.');
    });

    breaker.on('close', () => {
      this.logToFile('Circuit has been closed.');
    });

    breaker.on('halfOpen', () => {
      this.logToFile('Circuit is half open.');
    });

    return breaker;
  }

  static logToFile(message, req) {

    console.log("Attemping to print ");


    const logDir = `Logs/`;
    const logFile = `${logDir}/log-${new Date().toISOString().split('T')[0]}.txt`;

    console.log(logDir);

    fs.promises.mkdir(logDir, { recursive: true }).then(() => {
      fs.appendFile(logFile, `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) console.error(`Failed to write log: ${err}`);
      });
    });
  }
}

module.exports = CircuitBreakerHandler;
