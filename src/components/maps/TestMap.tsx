import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { AppUser } from "../../types/userProfile";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type TestMapProps = {
  appUsers: AppUser[];
};

type Location = {
  lat: number;
  lng: number;
};

const getLocationFromAddress = async (address: string) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === "OK") {
      return data.results[0].geometry.location;
    } else {
      console.error(`Geocoding error: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const TestMap: React.FC<TestMapProps> = ({ appUsers }) => {
  const [openInfoWindow, setOpenInfoWindow] = useState<number | null>(null);
  const [userLocations, setUserLocations] = useState<
    { user: AppUser; location: Location }[]
  >([]);
  const [center, setCenter] = useState<Location | undefined>(undefined);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await Promise.all(
        appUsers.map(async (user) => {
          const address = `${user.appuser.city_ward}, ${user.appuser.prefecture}`;
          const location = await getLocationFromAddress(address);
          return location ? { user, location } : null;
        })
      );

      const validLocations = locations.filter(Boolean) as {
        user: AppUser;
        location: Location;
      }[];

      setUserLocations(validLocations);

      if (validLocations.length > 0) {
        const avgLat =
          validLocations.reduce((sum, { location }) => sum + location.lat, 0) /
          validLocations.length;
        const avgLng =
          validLocations.reduce((sum, { location }) => sum + location.lng, 0) /
          validLocations.length;

        setCenter({ lat: avgLat, lng: avgLng });
      } else {
        setCenter({ lat: 35.6764, lng: 139.65 }); // Default to Tokyo
      }
    };

    fetchLocations();
  }, [appUsers]);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      {center && (
        <Map
          style={{ width: "100%", height: "100%" }}
          center={center}
          zoom={9}
          gestureHandling={"cooperative"}
          mapId={import.meta.env.VITE_MAP_ID}
          reuseMaps={true}
          onCenterChanged={(event) => {
            const newCenter = event.detail.center;
            setCenter(newCenter);
          }}
        >
          {userLocations.map(({ user, location }, index) => (
            <AdvancedMarker
              key={user.sitter.id}
              position={location}
              onClick={() => setOpenInfoWindow(index)}
            >
              <Pin
                background="#D87607"
                borderColor="white"
                glyphColor="white"
              />
              {openInfoWindow === index && (
                <InfoWindow
                  position={location}
                  onCloseClick={() => setOpenInfoWindow(null)}
                >
                  <div className="max-h-[360px] max-w-[340px] grid justify-items-stretch ml-1 mb-2">
                    <img
                      className="max-h-[220px] max-w-[220px] w-auto h-auto object-cover rounded-md"
                      src={user.appuser.profile_picture_src}
                    />
                    <h2 className="text-2xl mt-3 pb-2 text-gray-800 grid justify-items-center">
                      {user.appuser.firstname}
                    </h2>
                    <p className="text-m pb-4">
                      {user.sitter.sitter_profile_bio}
                    </p>
                    <button
                      className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-2 rounded w-full sm:w-auto"
                      onClick={() =>
                        navigate(`/profile/${user.sitter.appuser_id}`)
                      }
                    >
                      {t("searchPage.viewProfile")}
                    </button>
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}
        </Map>
      )}
    </APIProvider>
  );
};

export default TestMap;
