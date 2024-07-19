import { Map, Marker } from "pigeon-maps";
import { IUser } from "../../../models/session";
// import { stamenToner } from "pigeon-maps/providers";

interface IProps {
  user: IUser;
  users: IUser[] | undefined;
}

// function mapTiler(x, y, z, dpr) {
//   return `https://api.maptiler.com/maps/${
//     process.env.MAP_ID
//   }/256/${z}/${x}/${y}${dpr >= 2 ? "@2x" : ""}.png?key=${
//     process.env.MAPTILER_ACCESS_TOKEN
//   }`;
// }

const MapDisplay = ({ user, users }: IProps) => {
  return (
    <Map
      // provider={mapTiler}
      defaultCenter={[user?.coords?.latitude, user?.coords?.longitude]}
      defaultZoom={15}
    >
      {users?.map((u) => (
        <Marker
          key={u.id}
          width={30}
          anchor={[u.coords.latitude, u.coords.longitude]}
          color={"indianred"}
        />
      ))}
    </Map>
  );
};

export default MapDisplay;
