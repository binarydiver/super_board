import { useEffect, useState } from "react";
import "./Home.css";

type Site = {
  id: number;
  title: string;
  activeUrl: string;
  favIconUrl: string;
};

const Home = () => {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    chrome.storage.local
      .get("sites")
      .then((data) => {
        console.log("18: ", data);
        if (data.sites) {
          setSites(data.sites as Site[]);
        }
      })
      .catch(console.error);
  }, []);

  const SiteCard = () => {
    if (sites.length === 0) {
      return null;
    }

    console.log("31", sites);

    return (
      <>
        {sites.map((site, index) => {
          return (
            <div className="card" key={index}>
              <div className="divide-y divide-solid">{site.title}</div>
              <div>{site.activeUrl}</div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <h1 className="text-white text-center text-4xl">Super Board</h1>
      <div className="grid grid-cols-4 gap-4">
        <SiteCard />
      </div>
      <button className="bg-blue-500 py-4 px-8 rounded-lg">+</button>
    </>
  );
};

export default Home;
