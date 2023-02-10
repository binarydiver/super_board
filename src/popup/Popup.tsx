import { ChangeEvent, useEffect, useState } from "react";
import Tag from "../components/tag";
import Site from "../types/site";

const Popup = () => {
  // chrome.action.onClicked.addListener((tab) => {
  //   console.log("tab", tab.id);
  //   chrome.action.setTitle({
  //     tabId: tab.id,
  //     title: "You are on tab:" + tab.id,
  //   });
  // });

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [activeUrl, setActiveUrl] = useState<string>();
  const [favIconUrl, setFaviconUrl] = useState<string>();
  const isBuiltInUrl = activeUrl?.startsWith("edge://") || false;

  useEffect(() => {
    let queryOptions = { active: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.

    chrome.tabs
      .query(queryOptions)
      .then((tabs) => {
        const { url: activeUrl, title, favIconUrl } = tabs[0];

        if (favIconUrl) {
          setFaviconUrl(favIconUrl);
        }

        chrome.storage.local.get(["sites"]).then((localData) => {
          if (localData.sites) {
            const matchedSite = localData.sites.find((site: Site) => {
              if (!activeUrl) {
                return;
              }
              return site.activeUrl === btoa(activeUrl);
            });

            console.log("40:", title);

            if (matchedSite) {
              setTitle(matchedSite.title);
              setFaviconUrl(matchedSite.favIconUrl);
            } else {
              if (title) {
                setTitle(title);
              }
            }
          }

          if (localData.sites == null) {
            if (title) {
              setTitle(title);
            }
          }
        });
      })
      .catch(console.error);
  }, []);

  const clickSaveButton = () => {
    chrome.bookmarks
      .create({ title: "super_board" })
      .then((_) => {})
      .catch(console.error);

    chrome.storage.local
      .get(["sites"])
      .then((localData) => {
        let previousSites = [];
        if (localData.sites) {
          previousSites = localData.sites;
        }
        chrome.storage.local
          .set({
            sites: [
              ...previousSites,
              {
                createAt: Date.now(),
                title,
                activeUrl: btoa(activeUrl!),
                favIconUrl,
              },
            ],
          })
          .then(() => {
            console.log("63: ", { title, activeUrl, favIconUrl });

            window.close();
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

  const changeDescriptionInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 0) {
      // setDescription(value);
    }
  };

  const finishEditing = (tag: string) => {
    console.log("114: ", tags);
    setTags([...tags, tag]);
  };

  return (
    <>
      <form className="p-2">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium text-white">
            {isBuiltInUrl ? "Built-in url can't save!" : "Title"}
          </label>
          <input
            type="text"
            id="title"
            className="bg-slate-800 border disabled:cursor-not-allowed disabled:text-slate-500 enabled:focus:ring-1 text-white rounded-sm block w-full p-2 mb-2"
            value={title}
            onChange={changeTitleInput}
            required
            disabled={isBuiltInUrl}
          />
          <Tag tags={tags} onBlur={finishEditing} />
        </div>
      </form>
      <div className="px-2">
        <button
          type="button"
          className="border disabled:cursor-not-allowed disabled:text-slate-500 focus:outline-none focus:ring-1 font-medium rounded-sm text-sm px-4 py-2 mr-2 mb-2 bg-gray-800 text-white border-gray-600 enabled:hover:bg-gray-700 enabled:hover:border-gray-600 focus:ring-gray-700 w-full"
          onClick={clickSaveButton}
          disabled={isBuiltInUrl}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Popup;
