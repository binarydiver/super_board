import { ChangeEvent, useEffect, useState } from "react";
import Tag from "../components/tag";
import Site from "../types/site";

const Popup = () => {
  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [activeUrl, setActiveUrl] = useState<string>();
  const [favIconUrl, setFaviconUrl] = useState<string>();
  const isBuiltInUrl = activeUrl?.startsWith("edge://") || false;

  useEffect(() => {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs
      .query(queryOptions)
      .then((tabs) => {
        const { url: activeUrl, title, favIconUrl } = tabs[0];

        console.log("19: ", { activeUrl, title, favIconUrl });

        if (favIconUrl) {
          setFaviconUrl(favIconUrl);
        }

        if (activeUrl) {
          setActiveUrl(activeUrl);

          chrome.bookmarks.create({ title: "_SUPER_BOARD" }).then((node) => {
            chrome.bookmarks.search({ url: activeUrl }, (results) => {
              console.log("30: ", results);

              if (results.length === 0) {
                if (title) {
                  setTitle(title);
                }
              }

              const bookmarkIndexFromSuperBoard = results.findIndex((node) =>
                node.title.startsWith(":SB:")
              );
              if (bookmarkIndexFromSuperBoard === -1) {
                if (title) {
                  setTitle(title);
                }
              }

              results.forEach((result) => {
                if (result.title.startsWith(":SB:")) {
                  const titleComponents = result.title.split(":SB:");
                  setTitle(titleComponents[1]);
                  if (titleComponents[3]) {
                    setTags(titleComponents[3].split(","));
                  }
                }
              });
            });
          });
        }
      })
      .catch(console.error);
  }, []);

  const clickSaveButton = () => {
    chrome.bookmarks
      .create({ title: "_SUPER_BOARD" })
      .then((node) => {
        const titleWithTags =
          ":SB:" + title + ":SB:" + Date.now() + ":SB:" + tags.join(",");
        chrome.bookmarks.create({
          parentId: node.id,
          title: titleWithTags,
          url: activeUrl,
        });
      })
      .catch(console.error);
  };

  const changeTitleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 0) {
      setTitle(value);
    }
  };

  const finishEditing = (tag: string) => {
    console.log("72: ", tags);
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
