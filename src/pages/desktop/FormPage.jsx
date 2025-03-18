import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase"; // Firestore 설정
import courtData from "../../data/courtData"; // 경기장 정보
import DesktopLayout from "../../layout/DesktopLayout";
import FormInput from "../../components/form/FormInput";
import FormRadioGroup from "../../components/form/FormRadioGroup";
import FormButton from "../../components/form/FormButton";
import styled from "styled-components";
import decreaseRemainingSpots from "../../api/decreaseRemainingSpots";

const FormContainer = styled.div`
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
`;

const RemainingSeats = styled.div.attrs((props) => ({
  className: "remaining-seats", // 필요한 경우 추가 가능
}))`
  font-size: 12px;
  color: ${(props) => ("red")}; 
  text-align: center;
  margin-left: auto;
  margin-right: 3%;
  margin-top: -1px;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
  }
`;

const Image = styled.img`
  width: 90%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const NoticeContainer = styled.div`
  text-align: left;
  margin-top: 1px;
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;
`;

const NoticeItem = styled.p`
  margin: 5px 0;
  font-size: 13px;
  color: black;
  font-weight: normal;
`;

const FormPage = () => {
  const { courtId, matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { courtName, matchDate, matchTime } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(null);

  const courtInfo = courtData[courtId];

  useEffect(() => {
    const fetchRemainingSpots = async () => {
      if (!matchId) return;
      const matchRef = doc(db, "remainingspots", matchId);
      const matchSnap = await getDoc(matchRef);

      if (matchSnap.exists()) {
        setRemainingSpots(matchSnap.data().remainingSpots);
      }
    };

    fetchRemainingSpots();
  }, [matchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  let isSubmitting = false;

  const handleSubmit = async () => {
    if (loading || isSubmitting) return; 
    isSubmitting = true;

    if (!courtId || !matchId) {
      alert("올바른 경기 정보가 없습니다.");
      return;
    }
  
    if (remainingSpots <= 0) {
      alert("이 경기의 신청이 마감되었습니다.");
      return;
    }
    if (!formData.name || !formData.gender || !formData.age || !formData.phone) {
      alert("정보를 모두 기입해주세요.");
      return;
    }
  
    setLoading(true);
    try {
      await addDoc(collection(db, "match_registrations"), {
        matchId,
        courtId,
        ...formData,
        createdAt: new Date(),
      });
  
      await decreaseRemainingSpots(matchId);
  
      alert("신청이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("신청 저장 실패:", error);
      alert("신청 저장에 실패했습니다.");
    } finally{
      isSubmitting = false;
      setLoading(false);
    }
  };

  return (
    <DesktopLayout>
      <FormContainer>
        {courtInfo ? (
          <>
            <h2 style={{ marginTop: "40px" }}>{courtInfo.name}</h2>
            <p>주소: {courtInfo.address}</p>
            <Image src={courtInfo.image} alt={`${courtInfo.name} 이미지`} style={{ marginBottom: "10px" }} />
            <div style={{ width: "100%" }}>
              <p style={{ fontSize: "16px", fontWeight: "bold", marginTop: "0px", marginBottom: "-10px", display: "flex", flexDirection: "row" }}>
                {courtInfo.price || "5,000원"}
                <span style={{ fontSize: "12px", color: "#888", marginTop: "2px", marginLeft: "5px", display: "flex", flexDirection: "row", width: "80%" }}>
                  / {courtInfo.duration || "1시간"}
                  {remainingSpots !== null && (
                    <RemainingSeats remainingSpots={remainingSpots}>
                      {remainingSpots > 0 ? `남은 자리: ${remainingSpots}자리` : "신청이 마감되었습니다."}
                    </RemainingSeats>
                  )}
                </span>
              </p>
            </div>
            <p style={{ fontSize: "12px", color: "#666" }}>남자 5 VS 5</p>
          </>
        ) : (
          <p>경기장 정보를 불러올 수 없습니다.</p>
        )}

        <p>{matchDate} {matchTime}</p>
        <FormInput label="성함을 입력하세요" type="text" name="name" value={formData.name} onChange={handleChange} />
        <FormRadioGroup
          label="성별을 선택하세요"
          name="gender"
          options={[
            { value: "male", label: "남성" },
            { value: "female", label: "여성" },
          ]}
          selected={formData.gender}
          onChange={handleChange}
        />
        <FormInput label="나이를 입력하세요" type="text" name="age" value={formData.age} onChange={handleChange} />
        <FormInput label="전화번호를 입력하세요" type="tel" name="phone" value={formData.phone} onChange={handleChange} />

        {courtInfo ? (
          <>
            <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>주의사항</p>
            <NoticeContainer>
              {courtInfo.notice.map((line, index) => (
                <NoticeItem key={index}>{line}</NoticeItem>
              ))}
            </NoticeContainer>
          </>
        ) : (
          <p>경기장 정보를 불러올 수 없습니다.</p>
        )}
        <FormButton
          text={remainingSpots === 0 ? "마감됨" : loading ? "신청 중..." : "신청 완료"}
          onClick={handleSubmit}
          disabled={loading || remainingSpots === 0}
        />
      </FormContainer>
    </DesktopLayout>
  );
};

export default FormPage;