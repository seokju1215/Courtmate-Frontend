import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import courtData from "./courtData.js"; // ✅ 경기장 정보 가져오기

// 🔥 Firebase 설정 (firebase.js 파일과 동일해야 함)
const firebaseConfig = {
    apiKey: "AIzaSyB3v-D-OoLrUBVyh_JoEC1LZ7jOmSyWtoQ",
  authDomain: "courtmate-d4091.firebaseapp.com",
  projectId: "courtmate-d4091",
  storageBucket: "courtmate-d4091.firebasestorage.app",
  messagingSenderId: "484550600532",
  appId: "1:484550600532:web:65017db4bf16cd27d30ac1",
  measurementId: "G-73WRZGKRKZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * ✅ 2025년 3월 13일부터 23일까지 모든 날짜의 경기 데이터를 Firestore에 추가
 */
const generateMatchDataForAllDates = async () => {
    const matchesCollection = collection(db, "matches");
    let batch = writeBatch(db);
    let batchCount = 0;

    const startDate = new Date("2025-03-13");
    const endDate = new Date("2025-03-23");

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split("T")[0]; // yyyy-MM-dd 형식으로 변환
        const kstDate = new Date(`${formattedDate}T00:00:00+09:00`); // 한국 시간으로 변환

        let startHour = 16; // ✅ 모든 날짜에서 16시부터
        let endHour = 24; // ✅ 모든 날짜에서 24시까지

        for (const courtId in courtData) {
            const court = courtData[courtId];

            for (let hour = startHour; hour <= endHour; hour++) { // ✅ 16~24시 경기 추가
                // ✅ 정확한 UTC 기준으로 한국 시간(KST) 변환
                const matchTime = new Date(Date.UTC(
                    kstDate.getUTCFullYear(),
                    kstDate.getUTCMonth(),
                    kstDate.getUTCDate(),
                    hour - 9, // 한국 시간(KST)을 UTC로 변환
                    0, 0, 0
                ));

                const matchDoc = {
                    courtId: Number(courtId),
                    courtName: court.name,
                    matchtime: matchTime.toISOString(), // UTC 변환 후 Firestore 저장
                    registeredCount: 0,
                    remainingCount: 10,
                    totalCapacity: 10,
                };

                // ✅ batch.set()을 사용하여 데이터 추가
                const docRef = doc(matchesCollection);
                batch.set(docRef, matchDoc);
                batchCount++;

                // ✅ Firestore의 한계(500개) 도달 시 commit 실행 후 새로운 batch 생성
                if (batchCount >= 500) {
                    await batch.commit();
                    console.log(`🔥 500개 문서 저장 완료! (날짜: ${formattedDate})`);
                    batch = writeBatch(db); // 새로운 batch 시작
                    batchCount = 0;
                }
            }
        }
    }

    // ✅ 남은 데이터가 있다면 마지막 batch 실행
    if (batchCount > 0) {
        await batch.commit();
        console.log(`🔥 최종 경기 데이터 저장 완료!`);
    }

    console.log("🔥 모든 날짜(3월 13일 ~ 3월 23일) 경기 데이터 추가 완료!");
};

//
// 🔥 실행 예제
//

// ✅ 2025년 3월 13일부터 23일까지 모든 날짜의 경기 데이터를 추가
generateMatchDataForAllDates();