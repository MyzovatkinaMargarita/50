import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

export const TestCard = observer(({ test, lastAttempt }: any) => {
  const navigate = useNavigate();


  const attemptsLeft = test.attemptsLeft ?? test.attemptsAllowed;
  const hasActiveAttempt = !!test.hasActiveAttempt && !!test.activeAttemptId;
  const noAttemptsLeft = attemptsLeft !== null && attemptsLeft <= 0;

  const scoreText = typeof test.bestScore === "number" ? XXXINLINECODEXXX0XXXINLINECODEXXX : null;

  const action = useMemo(() => {
    if (hasActiveAttempt) return { kind: "resume" as const, label: "Продолжить" };
    if (noAttemptsLeft) return { kind: "locked" as const, label: "" };

    const isGraded = lastAttempt?.status === "graded" || !!test.hasGradedAttempt;
    if (isGraded && !test.allowRetry) return { kind: "done" as const, label: "Выполнено" };
    if (isGraded && test.allowRetry) return { kind: "retry" as const, label: "Пройти заново" };
    
    return { kind: "start" as const, label: "Пройти" };
  }, [hasActiveAttempt, noAttemptsLeft, lastAttempt?.status, test.hasGradedAttempt, test.allowRetry]);

  const resumeTest = () => navigate(XXXINLINECODEXXX1XXXINLINECODEXXX);
  const startTest = () => navigate(XXXINLINECODEXXX2XXXINLINECODEXXX);

  const handleClick = () => {
    if (action.kind === "done" || action.kind === "locked") return;
    if (action.kind === "resume") {
      resumeTest();
      return;
    }
    if (!test.timeLimit && test.attemptsAllowed !== 1) {
      startTest();
    } else {
      console.log("Показать модалку подтверждения");
    }
  };

  return (
    <div className="card">
      {scoreText && <div className="ribbon">Лучший результат: {scoreText}</div>}
      
   
      <div className="actions">
        {action.kind === "done" ? (
          <button disabled>Выполнено</button>
        ) : action.kind === "locked" ? 
          null : (
          <button onClick={handleClick}>{action.label}</button>
        )}
      </div>
    </div>
  );
});
