import { ChangeEvent, useEffect, useState } from "react";

const Popup = () => {
  // chrome.action.onClicked.addListener((tab) => {
  //   console.log("tab", tab.id);
  //   chrome.action.setTitle({
  //     tabId: tab.id,
  //     title: "You are on tab:" + tab.id,
  //   });
  // });

  const [title, setTitle] = useState<string>();
  const [activeUrl, setActiveUrl] = useState<string>();
  const [favIconUrl, setFaviconUrl] = useState<string>();
  const isBuiltInUrl = activeUrl?.startsWith("edge://") || false;

  useEffect(() => {
    let queryOptions = { active: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    chrome.tabs
      .query(queryOptions)
      .then((tabs) => {
        const title = tabs[0].title;
        if (title) {
          setTitle(title);
        }

        const activeUrl = tabs[0].url;
        if (activeUrl) {
          setActiveUrl(activeUrl);
        }

        const favIconUrl = tabs[0].favIconUrl;
        if (favIconUrl) {
          setFaviconUrl(favIconUrl);
        }
      })
      .catch(console.error);
  }, []);

  const clickSendButton = () => {
    chrome.storage.local
      .get("lastIndex")
      .then((localData) => {
        let id = 1;
        if (localData) {
          id = localData.lastIndex + 1;
          chrome.storage.local.set({ lastIndex: id });
        }

        chrome.storage.local
          .get(["sites"])
          .then((localData) => {
            let previousSites = [];
            if (localData.sites) {
              previousSites = localData.sites;
            }
            chrome.storage.local
              .set({
                sites: [...previousSites, { id, title, activeUrl, favIconUrl }],
              })
              .then(() => {
                console.log("63: ", { title, activeUrl, favIconUrl });

                window.close();
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  const changeTitleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 0) {
      setTitle(value);
    }
  };

  return (
    <>
      <form className="p-2">
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-white"
          >
            {isBuiltInUrl ? "Built-in url can't save!" : "Title"}
          </label>
          <input
            type="text"
            id="title"
            className="bg-slate-800 border disabled:cursor-not-allowed disabled:text-slate-500 enabled:focus:ring-1 text-white text-sm rounded-sm block w-full p-2"
            value={title}
            onChange={changeTitleInput}
            required
            disabled={isBuiltInUrl}
          />
        </div>
      </form>
      <div className="p-2">
        <button
          type="button"
          className="border disabled:cursor-not-allowed disabled:text-slate-500 focus:outline-none focus:ring-1 font-medium rounded-sm text-sm px-4 py-2 mr-2 mb-2 bg-gray-800 text-white border-gray-600 enabled:hover:bg-gray-700 enabled:hover:border-gray-600 focus:ring-gray-700 w-full"
          onClick={clickSendButton}
          disabled={isBuiltInUrl}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Popup;
