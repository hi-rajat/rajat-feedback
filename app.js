const form = document.querySelector("form");
const reload = () => {
  const lastFeedbackTime = parseInt(localStorage.getItem("feedback"));
  const currentTime = Date.now();
  const diff = currentTime - lastFeedbackTime;
  if (diff < 86400 * 1000) {
    form.innerHTML = `<br/><h1>You can give your next feedback after ${new Date(
      lastFeedbackTime + 86400 * 1000
    )}</h1>`;
  }
  const isFeedbackListShow = localStorage.getItem("feedbacklist") === "true";
  if (isFeedbackListShow) {
    fetchFeedback();
  }
};

reload();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitFeedback();
  alert("Thanks for your valuable feedback.");
  const time = Date.now();
  localStorage.setItem("feedback", time);
  localStorage.setItem("feedbacklist", true);
  reload();
});

function fetchFeedback() {
  const feedbacklist = document.querySelector(".feedbackList");
  fetch("https://rajat-feedback-default-rtdb.firebaseio.com/feedback.json")
    .then((res) => res.json())
    .then((data) => {
      let listContent = "<h2 style='margin-bottom: 2rem'>Rajat Feedbacks:</h2>";
      listContent += "<hr/>";
      listContent += "<ul style='list-style: none'>";
      for (let key in data) {
        const value = data[key].data;
        if (value) {
          listContent += `<li style="padding: 1rem">${value}</li>`;
          listContent += "<hr />";
        }
      }
      listContent += "</ul>";
      feedbacklist.innerHTML = listContent;
    });
}

const submitFeedback = () => {
  const feedbackValue = document.querySelector(".feedbackValue").value;
  if (feedbackValue) {
    fetch("https://rajat-feedback-default-rtdb.firebaseio.com/feedback.json", {
      method: "POST",
      body: JSON.stringify({
        data: feedbackValue,
      }),
    });
  }
};
