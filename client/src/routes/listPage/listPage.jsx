import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

// ListPage component for displaying a list of items with a filter and map
function ListPage() {
  // Hook to get data from the loader
  const data = useLoaderData();

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          {/* Filter component for filtering items */}
          <Filter />
          {/* Suspense component for handling loading state */}
          <Suspense fallback={<p>Loading...</p>}>
            {/* Await component for resolving data */}
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {/* Mapping through the postResponse data to display each post in a Card component */}
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        {/* Suspense component for handling loading state */}
        <Suspense fallback={<p>Loading...</p>}>
          {/* Await component for resolving data */}
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {/* Map component to display the posts on a map */}
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
