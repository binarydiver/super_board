function Popup() {
  chrome.action.onClicked.addListener(function (tab) {
    console.log("tab", tab.id);
    chrome.action.setTitle({
      tabId: tab.id,
      title: "You are on tab:" + tab.id,
    });
  });

  return (
    <>
      <h1>Popup</h1>
      <input />
      <button>Send</button>
    </>
  );
}

export default Popup;
