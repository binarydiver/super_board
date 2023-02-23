import { useEffect, useState } from "react";
import "./Home.css";
import Site from "./types/site";

const Home = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [rootNodeId, setRootNodeId] = useState<string>();

  const getMetadata = (node: chrome.bookmarks.BookmarkTreeNode) => {
    const data = node.title.split(":SB:");
    return {
      title: data[1],
      createdAt: parseInt(data[2]),
      tags: data[3].split(","),
    };
  };

  useEffect(() => {
    chrome.bookmarks.create({ title: "_SUPER_BOARD" }).then((node) => {
      setRootNodeId(node.id);
      chrome.bookmarks.getChildren(node.id, (childrenNodes) => {
        console.log("11", childrenNodes);
        const bookmarks = childrenNodes.map<Site>((node) => {
          const metadata = getMetadata(node);
          return { id: parseInt(node.id), ...metadata, activeUrl: node.url };
        });
        setSites(bookmarks);
      });
    });
  }, []);

  const SiteCard = ({ sites }: { sites: Site[] }) => {
    if (sites.length === 0) {
      return null;
    }

    console.log("31: ", sites);

    return (
      <>
        {sites.map((site, index) => {
          const host = site.activeUrl && new URL(site.activeUrl).host;
          const faviconUrl = `http://www.google.com/s2/favicons?domain=${host}`;
          return (
            <div className="card grid grid-flow-col overflow-x-auto">
              <div className="border-r p-2">
                <img src={faviconUrl} />
              </div>
              <div
                className="divide-y divide-solid divide-white text-white px-2"
                key={index}
              >
                <div className="py-2">{site.title}</div>
                <div className="py-2">{site.activeUrl}</div>
                <div className="py-2">{site.tags.join(", ")}</div>
              </div>
              <div className="border-l grid grid-rows-4 gap-4 p-2">
                <button type="button" className="text-white">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      {/* <h1 className="text-white text-center text-4xl">Super Board</h1> */}
      <div className="grid grid-cols-4 gap-4">
        <SiteCard sites={sites} />
      </div>
      {/* <button className="bg-blue-500 py-4 px-8 rounded-lg">+</button> */}
    </>
  );
};

export default Home;
