import { makeAutoObservable, runInAction } from "mobx";
import { apiClient } from "../../../api/apiClient";
import { StudentTestSummaryDto, TestItem, Attempt } from "../../../api/data-contracts";

class StudentTestsStore {
  tests: TestItem[] = [];
  attempts: Attempt[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async loadSummary() {
    const summaryRes = await apiClient.studentTestsSummaryList();
    const summary = summaryRes.data as StudentTestSummaryDto[];

    runInAction(() => {
      const byTestId = new Map<number, StudentTestSummaryDto>();
      for (const s of summary ?? []) {
        if (s?.testId) byTestId.set(s.testId, s);
      }

      this.tests = this.tests.map((t) => {
        const s = byTestId.get(t.id);
        if (!s) return t;
        return {
          ...t,
          attemptsLeft: s.attemptsLeft ?? null,
          hasActiveAttempt: !!s.hasActiveAttempt,
          activeAttemptId: s.activeAttemptId ?? null,
          hasGradedAttempt: !!s.hasGradedAttempt,
          bestScore: s.bestScore ?? null,
        };
      });
    });
  }

 
  get lastAttemptByTest(): Map<number, Attempt> {
    const byTest = new Map<number, Attempt>();
    for (const a of this.attempts) {
      byTest.set(a.testId, a);
    }
    return byTest;
  }

  
  get attemptsCountByTest(): Map<number, number> {
    const byTest = new Map<number, number>();
    for (const a of this.attempts) {
      byTest.set(a.testId, (byTest.get(a.testId) ?? 0) + 1);
    }
    return byTest;
  }
}
