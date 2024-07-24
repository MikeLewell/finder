import { Map, Marker } from "pigeon-maps";
import { IUser } from "../../models/session";
import CustomMarker from "../../patterns/marker";

interface IProps {
  user: IUser;
  users: IUser[] | undefined;
  trackingTarget?: IUser;
}

function mapTiler(x: number, y: number, z: number, dpr?: number): string {
  return `https://api.maptiler.com/maps/${
    process.env.REACT_APP_MAP_ID
  }/256/${z}/${x}/${y}${dpr && dpr >= 2 ? "@2x" : ""}.png?key=${
    process.env.REACT_APP_MAPTILER_ACCESS_TOKEN
  }`;
}

const MapDisplay = ({ user, users, trackingTarget }: IProps) => {
  // TODO appraise
  const getMarkerColor = (inputUserId: string) => {
    if (inputUserId === user.id) {
      return "#434343";
    }
    if (inputUserId === trackingTarget?.id) {
      return "darkseagreen";
    }
  };

  return (
    <Map
      provider={mapTiler}
      defaultCenter={[user?.coords?.latitude, user?.coords?.longitude]}
      defaultZoom={15}
    >
      {users?.map((u) => (
        <Marker key={u.id} anchor={[u.coords.latitude, u.coords.longitude]}>
          <CustomMarker
            text={u.name[0].toUpperCase()}
            color={getMarkerColor(u.id)}
          />
        </Marker>
      ))}
    </Map>
  );
};

export default MapDisplay;
