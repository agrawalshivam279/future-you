import fs from 'fs';
import path from 'path';
import { STORAGE_PREFIX } from '@/lib/constants';
import { useDecisionStore } from '@/stores/decision-store';
import { useCheckInStore } from '@/stores/check-in-store';
import { deleteAllLocalData } from '@/lib/storage/data-manager';
import { renderCardToSVG } from '@/lib/export/card-canvas-renderer';
import { DEFAULT_SHARE_CONFIG, ShareCardData, CARD_DIMENSIONS } from '@/types/share.types';

describe('Version 3 System Integration Audit & Release Invariants', () => {
  beforeEach(() => {
    localStorage.clear();
    useDecisionStore.getState().resetDecisionStore();
    useCheckInStore.getState().resetCheckInStore();
  });

  describe('1. Local-First Storage Namespace Invariant (future-you:*)', () => {
    it('verifies that all persistent stores utilize the future-you: prefix', () => {
      expect(STORAGE_PREFIX).toBe('future-you:');

      // Seed a decision scenario and check-in log
      const scenario = useDecisionStore.getState().addScenario({
        title: 'Join Early Stage AI Lab',
        description: 'Leaving Big Tech for autonomous systems research',
        primaryDomain: 'career',
        timeHorizon: '1year',
      });
      const log = useCheckInStore.getState().addLog({
        sleepHours: 8,
        exerciseFrequency: 'weekly',
        deepWorkHoursPerWeek: 25,
        screenTimeHoursPerDay: 2,
        savingsRatePercentage: 35,
      });

      expect(scenario.id).toBeDefined();
      expect(log.id).toBeDefined();

      // Check all stored localStorage keys
      const storedKeys = Object.keys(localStorage);
      for (const key of storedKeys) {
        expect(key.startsWith('future-you:')).toBe(true);
      }
    });
  });

  describe('2. Single-Click Data Purge Invariant', () => {
    it('purges all Version 3 stores cleanly on deleteAllLocalData()', async () => {
      // Seed stores
      useDecisionStore.getState().addScenario({
        title: 'Founder Track',
        description: 'Bootstrap autonomous agent tools',
        primaryDomain: 'career',
        timeHorizon: '1year',
      });
      useCheckInStore.getState().addLog({
        sleepHours: 7.5,
        exerciseFrequency: 'daily',
        deepWorkHoursPerWeek: 30,
        screenTimeHoursPerDay: 2,
        savingsRatePercentage: 40,
      });

      expect(useDecisionStore.getState().scenarios.length).toBe(1);
      expect(useCheckInStore.getState().logs.length).toBe(1);

      // Execute irreversible purge
      await deleteAllLocalData();

      // Verify in-memory stores are completely reset
      expect(useDecisionStore.getState().scenarios).toEqual([]);
      expect(useCheckInStore.getState().evaluations).toEqual({});
      expect(useCheckInStore.getState().logs).toEqual([]);

      // Verify localStorage is wiped clean
      expect(localStorage.getItem('future-you:decisions')).toBeNull();
      expect(localStorage.getItem('future-you:check-ins')).toBeNull();
    });
  });

  describe('3. Reflection Disclaimer Invariant Across AI Prompts & Artifacts', () => {
    const requiredDisclaimer = 'A reflection tool, not a prediction engine';

    it('validates mandatory reflection disclaimer is embedded in SVG exports', () => {
      const mockData: ShareCardData = {
        primaryGoal: 'Autonomous lab leadership',
        improvedHeadline: 'Principal Architect with compounding focus',
        currentHeadline: 'Status-quo developer routine',
        generatedAt: '2026-10-06T00:00:00.000Z',
        habits: [{ label: 'Deep Work', baseline: 10, target: 25 }],
      };

      const svg = renderCardToSVG(mockData, DEFAULT_SHARE_CONFIG);
      expect(svg.toLowerCase()).toContain(requiredDisclaimer.toLowerCase());
      expect(svg).toContain('FUTURE YOU');
    });

    it('verifies all prompt files in src/lib/prompts contain reflection honesty disclaimer', () => {
      const promptsDir = path.resolve(process.cwd(), 'src/lib/prompts');
      const promptFiles = fs
        .readdirSync(promptsDir)
        .filter((file) => file.endsWith('.ts') && !file.includes('.test.ts') && file !== 'index.ts');

      expect(promptFiles.length).toBeGreaterThanOrEqual(5);

      for (const file of promptFiles) {
        const content = fs.readFileSync(path.join(promptsDir, file), 'utf-8');
        expect(content.toLowerCase()).toContain('reflection tool');
      }
    });
  });

  describe('4. File Length Limit Invariant (<= 300 LOC)', () => {
    const criticalV3Files = [
      'src/app/dashboard/page.tsx',
      'src/app/simulator/page.tsx',
      'src/app/check-in/page.tsx',
      'src/components/share/shareable-card.tsx',
      'src/components/share/privacy-toggles.tsx',
      'src/components/share/share-actions.tsx',
      'src/components/share/share-modal.tsx',
      'src/components/dashboard/regenerate-modal.tsx',
      'src/lib/export/card-canvas-renderer.ts',
      'src/lib/export/card-export-actions.ts',
      'src/lib/scoring/drift-calculator.ts',
    ];

    it.each(criticalV3Files)('verifies %s is strictly <= 300 lines of code', (filePath) => {
      const absolutePath = path.resolve(process.cwd(), filePath);
      expect(fs.existsSync(absolutePath)).toBe(true);

      const content = fs.readFileSync(absolutePath, 'utf-8');
      const lines = content.split('\n');
      expect(lines.length).toBeLessThanOrEqual(300);
    });
  });

  describe('5. Aspect Ratio Dimensions Invariant', () => {
    it('verifies standard card aspect dimensions', () => {
      expect(CARD_DIMENSIONS.square).toEqual({ width: 1080, height: 1080 });
      expect(CARD_DIMENSIONS.portrait).toEqual({ width: 1080, height: 1350 });
      expect(CARD_DIMENSIONS.landscape).toEqual({ width: 1200, height: 675 });
    });
  });
});
