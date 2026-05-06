import { execSync } from 'child_process';
import * as path from 'path';

describe('type safety', () => {
  it('passes type checking (tsc --noEmit over src/ + types.*.probe.ts)', () => {
    const root = path.resolve(__dirname, '..');
    try {
      execSync('npx tsc --noEmit', { cwd: root, stdio: 'pipe' });
    } catch (e: any) {
      const stdout = e?.stdout?.toString() ?? '';
      const stderr = e?.stderr?.toString() ?? '';
      const status = typeof e?.status === 'number' ? ` (exit code: ${e.status})` : '';
      throw new Error(`Type checking failed${status}\n${stdout}${stderr}`);
    }
  });
});
