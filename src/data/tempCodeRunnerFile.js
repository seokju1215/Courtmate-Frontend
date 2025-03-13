(dayOfWeek === 0 || dayOfWeek === 1) { 
                // ✅ 일요일 (3월 16일, 3월 23일) → 06시부터 24시까지
                startHour = 6;
            } else {
                // ✅ 일반 주중 (월~목) 16시부터, 토요일 06시부터
                startHour = 16;
            } 