const resultDiv = document.getElementById("result");
function sendMessage() {
  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      const iframe = document.querySelector("iframe");
      iframe.contentWindow.postMessage(data, "*");
    });
}
setTimeout(sendMessage, 200);
window.addEventListener("message", function (event) {
  if (event.data.message) {
    resultDiv.innerHTML = `<h3>${JSON.stringify(event.data.message)}</h3>`;
  }
});
