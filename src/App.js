import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./styles/index.scss";

function App() {
  const numEntries = 15;
  const [giphyData, setGiphyData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&limit=1000&offset=0&rating=g&bundle=messaging_non_clips`
      )
      .then((res) => {
        setGiphyData(res.data.data);
      });
  }, []);

  const handleInputChange = (e) => {
    setSearchKey(e.target.value);
  };

  useEffect(() => {
    if (searchKey) {
      axios
        .get(
          `https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&q=${searchKey}&limit=1000&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
        )
        .then((res) => {
          setGiphyData(res.data.data);
        });
    } else {
      axios
        .get(
          `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY_API_KEY}&limit=1000&offset=0&rating=g&bundle=messaging_non_clips`
        )
        .then((res) => {
          setGiphyData(res.data.data);
        });
    }
  }, [searchKey]);

  // initializing show data
  useEffect(() => {
    const tempData = [...giphyData];
    setShowData(tempData.splice(0, numEntries));
    setCurrentIndex(numEntries);
  }, [giphyData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setIsLoading(true);
        setTimeout(() => {
          const tempData = giphyData.splice(
            currentIndex,
            currentIndex + numEntries
          );
          setCurrentIndex((prev) => prev + numEntries);
          setShowData((prev) => [...prev, ...tempData]);
          setIsLoading(false);
        }, 2000);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [giphyData]);

  const [isThemeDark, setIsThemeDark] = useState(false);

  const handleToggleTheme = () => {
    setIsThemeDark((prev) => !prev);
  };

  return (
    <div
      className="app-main"
      style={{ backgroundColor: isThemeDark ? "black" : "white" }}
    >
      <div className="app-main-toggle-btn">
        <button onClick={handleToggleTheme}>Toggle theme</button>
      </div>
      <div className="app-main-body">
        <div className="app-main-search">
          <input
            type="text"
            placeholder="Search here..."
            onChange={handleInputChange}
          />
        </div>
        <div className="app-main-gifs">
          {showData?.map((data) => {
            return (
              <div key={data.id}>
                <img src={data.images.fixed_height.url}></img>
              </div>
            );
          })}
        </div>
        <div ref={loaderRef}>
          {isLoading && (
            <p style={{ color: isThemeDark ? "white" : "black" }}>
              Loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
