import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function TestMap() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 36.2048, lng: 138.2529 }}
        defaultZoom={5}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        // zoom={5}
        // mapId={import.meta.env.VITE_MAP_ID}
      />
    </APIProvider>
  );
}
