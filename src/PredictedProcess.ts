import { spawn } from 'child_process';

const EXIT_CODE = 0;

export class PredictedProcess {
  // Our cache with the memoized prcesses.
  private _memoizedCache: { [key: string]: PredictedProcess } = {};

  public constructor(
    public readonly id: number,
    public readonly command: string,
  ) {}

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
    // TODO: Implement this.
  }

  /**
   * Returns a memoized version of `PredictedProcess`.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * ...
   *
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
