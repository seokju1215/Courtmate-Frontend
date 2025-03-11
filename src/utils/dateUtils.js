export const formatDateWithDay = (dateString) => {
  const date = new Date(dateString);

  const month = date.getMonth() + 1; 
  const day = date.getDate(); // 일
  const formattedDate = `${month}월 ${day}일`;

  const options = { weekday: "short" }; 
  const dayOfWeek = new Intl.DateTimeFormat("ko-KR", options).format(date);

  return `${formattedDate}\n${dayOfWeek}`; 
};