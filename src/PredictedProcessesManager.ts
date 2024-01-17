import type { PredictedProcess } from './PredictedProcess';

export class PredictedProcessesManager {
  private _processes: PredictedProcess[] = [];

  public constructor(processes: readonly PredictedProcess[] = []) {
    this._processes = processes.slice();
  }

  public get processes(): readonly PredictedProcess[] {
    return this._processes.slice();
  }

  public addProcess(process: PredictedProcess): this {
    this._processes.push(process);
    return this;
  }

  public removeProcess(id: number): this {
    this._processes = this._processes.filter((process) => process.id !== id);
    return this;
  }

  public getProcess(id: number): PredictedProcess | undefined {
    return this.processes.find((process) => process.id === id);
  }

  /**
   * Executes multiple predicted processes.
   *
   * WRITE UP:
   * (Please provide a detailed explanation of your approach, specifically the reasoning behind your design decisions. This can be done _after_ the 1h30m time limit.)
   *
   * 1. Using the Fail First approach, we avoid executing too much code when we know the promise will reject.
   *
   * 2. We map over the processes so we can run them all with Promise.all()
   *
   * 3. If all the processes are successfully executed, the promise will resolve.
   *
   * 4. In the case a Promise rejects or an error is thrown, we throw the error and reject the promise.
   */
  public async runAll(signal?: AbortSignal): Promise<void> {
    // Rejects immediately if its aborted
    if (signal?.aborted) {
      throw new DOMException('Signal already aborted', 'AbortError');
    }

    try {
      const promises = this._processes.map((process) => process.run(signal));

      // Executes all the processes
      await Promise.all(promises);
    } catch (error: any) {
      // Throw error when:
      // - A promise is rejected
      // - An error occurs during execution of the process
      throw new error();
    }
  }
}
