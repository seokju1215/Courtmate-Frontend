import { db } from "../config/firebase.js";
import { doc, runTransaction } from "firebase/firestore";

// `matchId`에 대한 remainingSpots을 -1 감소
const decreaseRemainingSpots = async (matchId) => {
  const matchRef = doc(db, "remainingspots", matchId);

  try {
    await runTransaction(db, async (transaction) => {
      const matchSnap = await transaction.get(matchRef);

      if (!matchSnap.exists()) {
        throw new Error(`❌ matchId: ${matchId} 가 존재하지 않습니다.`);
      }

      const currentSpots = matchSnap.data().remainingSpots;

      // remainingSpots 감소 (-1)
      transaction.update(matchRef, { remainingSpots: currentSpots - 1 });
    });

    console.log(`✅ matchId: ${matchId} -> remainingSpots 감소 완료!`);
  } catch (error) {
    console.error(`❌ 오류 발생 (matchId: ${matchId}):`, error.message);
  }
};

export default decreaseRemainingSpots;