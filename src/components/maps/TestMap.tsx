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
  // console.log(geocodeUrl);

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
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
  // console.log("AppUsers in TestMap:", appUsers);

  // appUsers.map((user) => {
  //   console.log("city_ward:", user.appuser.city_ward);
  //   console.log("prefecture:", user.appuser.prefecture);
  // });

  const position = { lat: 35.6764, lng: 139.65 };
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const [userLocations, setUserLocations] = useState<
    { user: AppUser; location: Location }[]
  >([]);

  const navigate = useNavigate();
  const goToNewPage = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const { t } = useTranslation();

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await Promise.all(
        appUsers.map(async (user) => {
          const address =
            user.appuser.city_ward + ", " + user.appuser.prefecture;
          // console.log(address);
          const location = await getLocationFromAddress(address);
          // console.log(location);
          return location ? { user, location } : null;
        })
      );
      setUserLocations(
        locations.filter(Boolean) as { user: AppUser; location: Location }[]
      );
    };

    fetchLocations();
  }, [appUsers]);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={position}
        defaultZoom={9}
        gestureHandling={"greedy"}
        mapId={import.meta.env.VITE_MAP_ID}
      >
        {userLocations.map(({ user, location }, index) => (
          <AdvancedMarker
            key={user.sitter.id}
            position={location}
            // onClick={() => onPinClick(user.sitter.id)}
            onClick={() => setOpenInfoWindow(index)}
          >
            <Pin background="#D87607" borderColor="white" glyphColor="white" />
            {openInfoWindow === index && (
              <InfoWindow
                position={location}
                onCloseClick={() => setOpenInfoWindow(null)}
              >
                <div className="max-h-[340px] max-w-[300px] grid justify-items-stretch">
                  <img
                    className="max-h-[220px] max-w-[220px]"
                    src={user.appuser.profile_picture_src}
                  />
                  <h2 className="text-2xl font-semibold mt-3 text-gray-800">
                    {user.appuser.firstname}
                  </h2>
                  <p className="pb-2">{user.sitter.sitter_profile_bio}</p>
                  <button
                    className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded w-full sm:w-auto"
                    onClick={() => goToNewPage(user.sitter.appuser_id)}
                  >
                    {t("searchPage.viewProfile")}
                  </button>
                </div>
              </InfoWindow>
            )}
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
};

export default TestMap;
