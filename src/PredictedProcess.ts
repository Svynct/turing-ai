import { spawn } from 'child_process';

const EXIT_CODE = 0;

export class PredictedProcess {
  // Our cache with the memoized prcesses.
  private _memoizedCache: { [key: string]: PredictedProcess } = {};

  public constructor(
    public readonly id: number,
    public readonly command: string,
  ) {}

  // This function generates the cache key for a process.
  private generateCacheKey(signal?: AbortSignal): string {
    return `${this.id}_${signal?.aborted}`;
  }

  /**
   * Spawns and manages a child process to execute a given command, with handling for an optional AbortSignal.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * ...
   *
   */
  public async run(signal?: AbortSignal): Promise<void> {
    // Rejects immediately if its aborted
    if (signal?.aborted) {
      return Promise.reject(
        new DOMException('Signal already aborted!', 'AbortError'),
      );
    }

    const cacheKey = this.generateCacheKey(signal);
    if (cacheKey in this._memoizedCache) {
      return;
    }

    const promiseToSend = new Promise<void>((resolve, reject) => {
      const child = spawn(this.command);
      child.on('error', (error: any) => {
        // Rejects if encounters an error
        return reject(error);
      });

      child.on('close', (event: any) => {
        if (event !== EXIT_CODE || !child) {
          return;
        }

        child.kill();
        child.removeAllListeners();

        // Resolving promise when process is executed
        return resolve();
      });

      // Create handler function to reject the promise in case the signal is aborted during execution
      const abortSignalHandler = (event: any) => {
        return reject(new DOMException('Signal already aborted', 'AbortError'));
      };

      signal?.addEventListener('abort', abortSignalHandler, { once: true });
    }) as Promise<void>;

    // Memoizing child process
    this._memoizedCache[cacheKey] = this;

    try {
      await promiseToSend;
    } catch (error) {
      // Deleting from cache when facing an error
      delete this._memoizedCache[cacheKey];
      throw error;
    }
  }

  /**
   * Returns a memoized version of `PredictedProcess`.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * 1. First we generate the cache key for the process: ID + signal.aborted (initially, ID + undefined)
   *
   * 2. We check for that key inside the cache. If the key is found, we return the memoized value.
   *
   * 3. If the key is not found, we save the process inside the cache and return it.
   */
  public memoize(): PredictedProcess {
    const cacheKey = `${this.id}_undefined`;

    if (cacheKey in this._memoizedCache) {
      return this._memoizedCache[cacheKey];
    }

    this._memoizedCache[cacheKey] = this;
    return this._memoizedCache[cacheKey];
  }
}
