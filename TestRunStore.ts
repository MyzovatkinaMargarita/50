import { makeAutoObservable, runInAction } from "mobx";
import { apiClient } from "../../../api/apiClient"; 
import { AttemptReviewDto, TestResponse, TestResultDetailResponse } from "../../../api/data-contracts";
import { mapQuestionDto } from "../../domains/tests/questionsMappers";

class TestRunStore {

  attemptId: number | null = null;
  test: TestResponse | null = null;
  review: AttemptReviewDto | null = null;
  detail: TestResultDetailResponse | null = null;
  
  questions: any[] = [];
  answers: Map<number, any> = new Map();

  constructor() {
    makeAutoObservable(this);
  }


  get durationSec(): number {
    const minutes = (this.test as any)?.durationMinutes;
    if (typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0) {
      return Math.floor(minutes * 60);
    }
    return 600; 
  }

  get answeredCount(): number {
    let count = 0;
    this.questions.forEach(q => {
      const a = this.answers.get(q.id);
      if (!a) return;

      if (q.type === "single") {
        if (typeof a.value === "number") count++;
      } else {
        if (a.value !== null) count++;
      }
    });
    return count;
  }
}
