import { Map, Marker } from "pigeon-maps";
import CustomMarker from "../../patterns/marker";
import { IUser } from "../../models/user";

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

const MapDisplay: React.FC<IProps> = ({ user, users, trackingTarget }) => {
  return (
    <Map
      provider={mapTiler}
      defaultCenter={[user?.coords?.latitude, user?.coords?.longitude]}
      defaultZoom={15}
    >
      {users?.map((u) => (
        <Marker key={u.id} anchor={[u.coords.latitude, u.coords.longitude]}>
          <CustomMarker
            text={u.id === user.id ? "ME" : u.name[0].toUpperCase()}
            color={u.id === trackingTarget?.id ? "lightseagreen" : undefined}
          />
        </Marker>
      ))}
    </Map>
  );
};

export default MapDisplay;
