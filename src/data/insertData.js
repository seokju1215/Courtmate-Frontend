import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import courtData from "./courtData.js"; // ✅ 경기장 정보 가져오기

// 🔥 Firebase 설정 (firebase.js 파일과 동일해야 함)
const firebaseConfig = {
    apiKey: "AIzaSyDxbC32-dHog43fnjG7yHkAglruVaYDdUg",
    authDomain: "courtmate-8fc18.firebaseapp.com",
    projectId: "courtmate-8fc18",
    storageBucket: "courtmate-8fc18.firebasestorage.app",
    messagingSenderId: "595806894020",
    appId: "1:595806894020:web:62a006bcacb442f4a09691",
    measurementId: "G-TGB46XSES6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateMatchData = async () => {
  const matchesCollection = collection(db, "matches");

  // 📅 2025년 3월 12일 ~ 3월 23일 날짜 생성
  const startDate = new Date("2025-03-12");
  const endDate = new Date("2025-03-23");

  for (const courtId in courtData) {
    const court = courtData[courtId];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const day = date.getDate(); // 날짜 추출 (12~23)
      const isWeekend = [15, 16, 22, 23].includes(day); // 주말인지 확인

      let startHour = isWeekend ? 6 : 16; // 주말: 06시 / 평일: 16시
      let endHour = 25; // 00:00까지 포함하려면 25로 설정

      for (let hour = startHour; hour < endHour; hour++) {
        const matchTime = new Date(date);
        matchTime.setHours(hour % 24, 0, 0, 0); // ✅ 24시는 00:00으로 변환

        const matchDoc = {
          courtId: Number(courtId),
          courtName: court.name,
          matchtime: matchTime.toISOString(), // Firestore 저장용 ISO 형식
          registeredCount: 0,
          remainingCount: 10, // 기본 10자리 남음
          totalCapacity: 10,
        };

        try {
          await addDoc(matchesCollection, matchDoc);
          console.log(`✅ 매치 추가됨: ${court.name} - ${matchTime.toISOString()}`);
        } catch (error) {
          console.error("❌ Firestore 저장 실패:", error);
        }
      }
    }
  }
};

// 🔥 실행
generateMatchData().then(() => {
  console.log("🔥 모든 데이터 추가 완료!");
});